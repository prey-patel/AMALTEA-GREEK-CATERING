-- Supabase Database Schema, Row Level Security (RLS) Policies, Custom Functions, and Triggers
-- Reference Project: aegean-catering-prod (opwutcxkorpdradbalwl)

-- =========================================================================
-- TABLE SCHEMAS
-- =========================================================================

-- 1. admin_users Table
-- Stores user authorization statuses and roles (owner / admin).
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'admin'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    is_active boolean DEFAULT true,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at timestamp with time zone
);

-- 2. audit_logs Table
-- Stores actions completed by administrators for safety audit trailing.
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email text,
    action text NOT NULL,
    target_table text,
    target_id text,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. catering_categories Table
-- Stores submenu/subcategory card data displayed under Business & Private pages.
CREATE TABLE IF NOT EXISTS public.catering_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page text NOT NULL, -- 'business' or 'private'
    title_en text NOT NULL,
    title_pl text NOT NULL,
    description_en text NOT NULL,
    description_pl text NOT NULL,
    icon_name text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    menu_pdf_url text
);

-- 4. gallery Table
-- Stores public paths to uploaded images from the portfolio/gallery sections.
-- IMPORTANT: Anonymous users have NO direct SELECT on this table.
-- They must use the gallery_public view instead.
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    file_path text,
    title text,
    alt_text text,
    category text NOT NULL DEFAULT 'food'::text,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid()
);

-- 4b. gallery_public View (defense-in-depth)
-- Exposes only display-safe columns. No file_path, no created_by.
-- Anonymous users read from this view; admins read from the table directly.
CREATE OR REPLACE VIEW public.gallery_public 
WITH (security_invoker = true) AS
SELECT
    id,
    image_url,
    title,
    alt_text,
    category,
    description,
    created_at
FROM public.gallery;

GRANT SELECT ON public.gallery_public TO anon;
GRANT SELECT ON public.gallery_public TO authenticated;
REVOKE ALL ON public.gallery FROM anon;

-- 5. inquiries Table
-- Stores client form submissions for catering request booking.
CREATE TABLE IF NOT EXISTS public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id character varying NOT NULL UNIQUE,
    full_name character varying NOT NULL CONSTRAINT chk_fullname_nonempty CHECK (length(trim(full_name)) > 0),
    phone character varying NOT NULL CONSTRAINT chk_phone_nonempty CHECK (length(trim(phone)) > 0),
    email character varying NOT NULL CONSTRAINT chk_email_nonempty CHECK (length(trim(email)) > 0),
    event_date date NOT NULL,
    guests_count integer NOT NULL CONSTRAINT chk_guests_positive CHECK (guests_count > 0),
    event_type character varying NOT NULL CONSTRAINT chk_eventtype_nonempty CHECK (length(trim(event_type)) > 0),
    location character varying NOT NULL,
    custom_notes text,
    created_at timestamp with time zone NOT NULL DEFAULT (timezone('utc'::text, now())),
    event_time character varying,
    event_duration character varying,
    service_requirements character varying,
    menu_preferences character varying,
    additional_info text,
    message text,
    status text DEFAULT 'new'::text CONSTRAINT chk_status_valid CHECK (
        status IN ('new', 'admin_email_sent', 'admin_email_failed', 'contacted', 'confirmed', 'completed', 'cancelled')
    ),
    ip_address text
);

-- 6. page_heroes Table
-- Stores dynamic page hero headings, badges, and background media assets.
CREATE TABLE IF NOT EXISTS public.page_heroes (
    id text PRIMARY KEY, -- e.g., 'home', 'about', 'business', 'private'
    badge_en text NOT NULL,
    badge_pl text NOT NULL,
    title_en text NOT NULL,
    title_pl text NOT NULL,
    subtitle_en text NOT NULL,
    subtitle_pl text NOT NULL,
    image_url text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


-- =========================================================================
-- ENABLE ROW LEVEL SECURITY (after table creation)
-- =========================================================================
-- IMPORTANT: These must come AFTER CREATE TABLE to ensure RLS is actually
-- activated. Running them before tables exist causes a silent no-op.

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_heroes ENABLE ROW LEVEL SECURITY;


-- =========================================================================
-- CUSTOM DATABASE FUNCTIONS
-- =========================================================================

-- Function: is_admin
-- Checks if active auth user is an active administrator.
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND is_active = true
  );
END;
$function$;

-- Function: is_owner
-- Checks if active auth user is an active system owner.
CREATE OR REPLACE FUNCTION public.is_owner()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'owner' AND is_active = true
  );
END;
$function$;

-- Function: check_last_owner
-- Constraint check preventing deletion/demotion of the last active owner.
CREATE OR REPLACE FUNCTION public.check_last_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- If we are deleting an owner, or demoting an owner, or disabling an owner
  IF (TG_OP = 'DELETE' AND OLD.role = 'owner') OR 
     (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.role != 'owner') OR
     (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.is_active = false) THEN
    
    IF (SELECT count(*) FROM public.admin_users WHERE role = 'owner' AND is_active = true) <= 1 THEN
      RAISE EXCEPTION 'Cannot remove, disable, or demote the last active owner.';
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Function: log_admin_action
-- Audits admin actions securely by inserting logs with system privileges (SECURITY DEFINER).
CREATE OR REPLACE FUNCTION public.log_admin_action(action text, target_table text, target_id text, metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_email text;
BEGIN
  -- Verify if sender is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized admin action';
  END IF;

  -- Get email from auth.jwt()
  v_email := auth.jwt() ->> 'email';

  -- Insert log
  INSERT INTO public.audit_logs (user_id, user_email, action, target_table, target_id, metadata)
  VALUES (auth.uid(), v_email, action, target_table, target_id, metadata);
END;
$function$;


-- =========================================================================
-- DATABASE TRIGGERS
-- =========================================================================

-- Trigger to prevent ownerless setups
CREATE OR REPLACE TRIGGER enforce_last_owner
    BEFORE UPDATE OR DELETE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION public.check_last_owner();


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Table: admin_users
CREATE POLICY "Allow owners and admins to select all admin profiles"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Allow users to select own admin profile"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id) AND (is_active = true));

-- Table: audit_logs
CREATE POLICY "Allow admin read logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Table: catering_categories
CREATE POLICY "Allow admins to modify catering_categories"
    ON public.catering_categories
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Allow public read access to catering_categories"
    ON public.catering_categories
    FOR SELECT
    TO public
    USING (true);

-- Table: gallery
-- Anonymous users have NO direct access to the gallery table.
-- They use the gallery_public view instead (see above).
CREATE POLICY "Allow admin manage"
    ON public.gallery
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- NOTE: The old "Allow public select" policy (TO public, USING true) has been
-- replaced by the gallery_public view. Authenticated admin access is handled
-- by the "Allow admin manage" policy above.

-- Table: inquiries
CREATE POLICY "Allow admins/owners to manage inquiries"
    ON public.inquiries
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Table: page_heroes
CREATE POLICY "Allow admins to update page_heroes"
    ON public.page_heroes
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Allow public read access to page_heroes"
    ON public.page_heroes
    FOR SELECT
    TO public
    USING (true);


-- =========================================================================
-- REVOKE / GRANT PRIVILEGES (SECURITY HARDENING)
-- =========================================================================

-- Revoke execute on all functions from PUBLIC, anon, and authenticated to prevent unauthorized RPC execution
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_last_owner() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, text, text, jsonb) FROM PUBLIC, anon, authenticated;

-- Grant execute only to authenticated admins and service role where required
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.log_admin_action(text, text, text, jsonb) TO authenticated, service_role;


-- =========================================================================
-- STORAGE BUCKETS & OBJECT POLICIES (REFERENCE)
-- =========================================================================

-- Configured Storage Bucket: 'gallery' (Public access enabled)

-- Policy 1: (DROPPED for security hardening)
-- "Allow public read access to gallery" has been dropped to prevent anonymous
-- clients from listing all files in the bucket. Accessing files via direct
-- public URLs does not require SELECT policies.

-- Policy 2: "Allow admin to upload to gallery"
-- Action: INSERT, Role: authenticated
-- Definition / WITH CHECK: ((bucket_id = 'gallery'::text) AND is_admin())

-- Policy 3: "Allow admin to delete from gallery"
-- Action: DELETE, Role: authenticated
-- Definition / USING: ((bucket_id = 'gallery'::text) AND is_admin())
