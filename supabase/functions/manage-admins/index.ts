import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = 
    origin === "" || 
    origin.startsWith("http://localhost:") || 
    origin === "https://aegean-catering.vercel.app" ||
    /^https:\/\/aegean-catering-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);
    
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://aegean-catering.vercel.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Retrieve auth header to check JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization token." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Verify caller JWT validity
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    const { data: { user: caller }, error: callerError } = await userClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid JWT token." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Check caller role in public.admin_users using service-role key
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: callerProfile, error: profileError } = await adminClient
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', caller.id)
      .single();

    if (profileError || !callerProfile) {
      return new Response(JSON.stringify({ error: "Forbidden: Caller is not registered as an administrator." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!callerProfile.is_active) {
      return new Response(JSON.stringify({ error: "Forbidden: Caller admin account is currently disabled." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (callerProfile.role !== 'owner') {
      return new Response(JSON.stringify({ error: "Forbidden: Only active owners can perform administrator management." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Parse action and params from body
    const body = await req.json();
    const { action, params } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: "Missing action parameter." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://aegean-catering.vercel.app";
    const redirectTo = `${origin}/admin`;

    switch (action) {
      case "LIST_ADMINS": {
        // Fetch all auth users
        const { data: { users }, error: authUsersError } = await adminClient.auth.admin.listUsers();
        if (authUsersError) {
          throw authUsersError;
        }

        // Fetch database roles
        const { data: dbAdmins, error: dbAdminsError } = await adminClient
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: true });

        if (dbAdminsError) {
          throw dbAdminsError;
        }

        // Merge in-memory
        const adminList = dbAdmins.map(admin => {
          const authUser = users.find(u => u.id === admin.user_id);
          return {
            user_id: admin.user_id,
            email: authUser ? authUser.email : 'Unknown',
            role: admin.role,
            is_active: admin.is_active,
            created_at: admin.created_at,
            created_by: admin.created_by
          };
        });

        return new Response(JSON.stringify({ success: true, admins: adminList }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "INVITE_ADMIN": {
        const { email, role } = params;
        if (!email || !role) {
          return new Response(JSON.stringify({ error: "Missing email or role parameters." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (role !== 'owner') {
          return new Response(JSON.stringify({ error: "Invalid role specified. Only owner role is allowed." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check if email already exists in admin_users via auth list to avoid double inserts
        const { data: { users } } = await adminClient.auth.admin.listUsers();
        const existingAuthUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (existingAuthUser) {
          // Check if already in db
          const { data: existingDbAdmin } = await adminClient
            .from('admin_users')
            .select('user_id')
            .eq('user_id', existingAuthUser.id)
            .maybeSingle();

          if (existingDbAdmin) {
            return new Response(JSON.stringify({ error: "Administrator account already exists for this email." }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        // Trigger Supabase Auth invitation
        const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
          redirectTo
        });

        if (inviteError) {
          return new Response(JSON.stringify({ error: inviteError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const invitedUser = inviteData.user;

        // Insert database role mapping
        const { error: dbInsertError } = await adminClient
          .from('admin_users')
          .insert({
            user_id: invitedUser.id,
            role,
            is_active: true,
            created_by: caller.id
          });

        if (dbInsertError) {
          // Rollback invited auth user if database mapping fails
          await adminClient.auth.admin.deleteUser(invitedUser.id);
          return new Response(JSON.stringify({ error: `Database setup failed: ${dbInsertError.message}. Invitation rolled back.` }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'CREATE_ADMIN_USER',
          target_table: 'admin_users',
          target_id: invitedUser.id,
          metadata: { email, role }
        });

        return new Response(JSON.stringify({ success: true, message: `Invitation successfully sent to ${email}.` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "UPDATE_ADMIN_EMAIL": {
        const { target_user_id, new_email } = params;
        if (!target_user_id || !new_email) {
          return new Response(JSON.stringify({ error: "Missing target_user_id or new_email parameters." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update email in Auth (sends confirmations if configured)
        const { error: updateError } = await adminClient.auth.admin.updateUserById(target_user_id, {
          email: new_email,
          email_confirm: true
        });

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'UPDATE_ADMIN_EMAIL',
          target_table: 'admin_users',
          target_id: target_user_id,
          metadata: { new_email }
        });

        return new Response(JSON.stringify({ success: true, message: `Email updated successfully.` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "SEND_PASSWORD_RESET": {
        const { target_email } = params;
        if (!target_email) {
          return new Response(JSON.stringify({ error: "Missing target_email parameter." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Send reset email
        const { error: resetError } = await adminClient.auth.resetPasswordForEmail(target_email, {
          redirectTo
        });

        if (resetError) {
          return new Response(JSON.stringify({ error: resetError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'SEND_PASSWORD_RESET',
          target_table: 'auth.users',
          target_id: null,
          metadata: { email: target_email }
        });

        return new Response(JSON.stringify({ success: true, message: `Password reset email sent to ${target_email}.` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "DISABLE_ADMIN_USER": {
        const { target_user_id, is_active } = params;
        if (!target_user_id || is_active === undefined) {
          return new Response(JSON.stringify({ error: "Missing target_user_id or is_active parameters." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (target_user_id === caller.id) {
          return new Response(JSON.stringify({ error: "Forbidden: You cannot disable your own admin account." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update database active state (Trigger checks last owner safeguard)
        const { error: updateError } = await adminClient
          .from('admin_users')
          .update({ is_active, updated_at: new Date().toISOString() })
          .eq('user_id', target_user_id);

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'DISABLE_ADMIN_USER',
          target_table: 'admin_users',
          target_id: target_user_id,
          metadata: { is_active }
        });

        return new Response(JSON.stringify({ success: true, message: is_active ? "Account enabled." : "Account disabled." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "UPDATE_ADMIN_ROLE": {
        const { target_user_id, role } = params;
        if (!target_user_id || !role) {
          return new Response(JSON.stringify({ error: "Missing target_user_id or role parameters." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (role !== 'owner') {
          return new Response(JSON.stringify({ error: "Invalid role specified. Only owner role is allowed." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update role in database (Trigger checks last owner safeguard)
        const { error: updateError } = await adminClient
          .from('admin_users')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('user_id', target_user_id);

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'UPDATE_ADMIN_ROLE',
          target_table: 'admin_users',
          target_id: target_user_id,
          metadata: { new_role: role }
        });

        return new Response(JSON.stringify({ success: true, message: `Role updated to ${role}.` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "REMOVE_ADMIN_ROLE": {
        const { target_user_id } = params;
        if (!target_user_id) {
          return new Response(JSON.stringify({ error: "Missing target_user_id parameter." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (target_user_id === caller.id) {
          return new Response(JSON.stringify({ error: "Forbidden: You cannot remove admin role from yourself." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Delete mapping from database (Trigger checks last owner safeguard)
        const { error: deleteError } = await adminClient
          .from('admin_users')
          .delete()
          .eq('user_id', target_user_id);

        if (deleteError) {
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Write Audit Log
        await adminClient.from('audit_logs').insert({
          user_id: caller.id,
          user_email: caller.email,
          action: 'REMOVE_ADMIN_ROLE',
          target_table: 'admin_users',
          target_id: target_user_id,
          metadata: {}
        });

        return new Response(JSON.stringify({ success: true, message: `Admin access removed.` }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default: {
        return new Response(JSON.stringify({ error: "Invalid action specified." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
  } catch (err: unknown) {
    console.error("manage-admins error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + (err instanceof Error ? err.message : String(err)) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
