import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";
const BREVO_SENDER_EMAIL = Deno.env.get("BREVO_SENDER_EMAIL") || "";
const BREVO_SENDER_NAME = Deno.env.get("BREVO_SENDER_NAME") || "Amaltea Catering";
const ADMIN_INQUIRY_EMAIL = Deno.env.get("ADMIN_INQUIRY_EMAIL") || "catering@amaltea.com.pl";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  
  // Whitelist only local development, production, and project-specific preview domains
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

function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendBrevoEmail(payload: any, apiKey: string) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API returned error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
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

  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      eventDate,
      eventTime,
      eventAddress,
      guestsCount,
      eventDuration,
      eventType,
      serviceRequirements,
      menuPreferences,
      additionalInfo,
      message,
      lang,
      website, // Honeypot field
    } = body;

    const isPl = lang === "pl";

    // 1. Honeypot check
    if (website && website.trim().length > 0) {
      console.log("Honeypot protection triggered. Silently ignoring submission.");
      // Return a fake success message to deceive the spam bot
      const msg = isPl 
        ? `Dzień dobry, ${fullName}! Twoje zapytanie zostało zarejestrowane. Skontaktujemy się wkrótce.`
        : `Kali Mera, ${fullName}! Your inquiry has been logged safely. We will contact you shortly.`;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: msg,
          referenceId: `AEG-SPAM-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Form validation
    if (!fullName || !phone || !email || !eventDate || !eventTime || !eventAddress || !guestsCount || !eventType) {
      return new Response(
        JSON.stringify({ success: false, error: isPl ? "Brak wymaganych parametrów zapytania." : "Missing required inquiry parameters." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: isPl ? "Nieprawidłowy format adresu e-mail." : "Invalid email address format." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2b. Server-side business rule validation
    const parsedGuests = Number(guestsCount);
    if (!Number.isFinite(parsedGuests) || parsedGuests < 1) {
      return new Response(
        JSON.stringify({ success: false, error: isPl ? "Liczba gości musi wynosić co najmniej 1." : "Guest count must be at least 1." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate event_date is a valid date string (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventDate) || isNaN(new Date(eventDate).getTime())) {
      return new Response(
        JSON.stringify({ success: false, error: isPl ? "Nieprawidłowy format daty wydarzenia." : "Invalid event date format." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const clientIp = 
      req.headers.get("x-real-ip") || 
      req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || 
      "unknown";

    // Create Supabase client with Service Role Key to bypass RLS for insertion
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3. Rate limiting check (max 5 submissions per 10 minutes per IP and/or email)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    // Sanitize parameters for PostgREST .or() filter to prevent injection
    const sanitizedIp = clientIp.replace(/[",\\]/g, "");
    const sanitizedEmail = email.replace(/[",\\]/g, "");

    const { count, error: countError } = await supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .or(`ip_address.eq."${sanitizedIp}",email.eq."${sanitizedEmail}"`)
      .gt("created_at", tenMinutesAgo);

    if (countError) {
      console.error("Rate-limit check error:", countError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: isPl 
            ? "Błąd systemu. Spróbuj ponownie później." 
            : "System busy. Please try again later." 
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (count && count >= 5) {
      console.warn(`Rate limit exceeded for IP: ${clientIp} or Email: ${email}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: isPl 
            ? "Zbyt wiele zapytań z tego połączenia. Spróbuj ponownie za 10 minut." 
            : "Too many requests. Please try again in 10 minutes."
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Generate reference ID and save to Database (with collision retry)
    const MAX_INSERT_RETRIES = 3;
    let refId = "";
    let insertSuccess = false;

    for (let attempt = 0; attempt < MAX_INSERT_RETRIES; attempt++) {
      refId = `AEG-${Math.floor(100000 + Math.random() * 900000)}`;

      const { error: insertError } = await supabase.from("inquiries").insert([{
        reference_id: refId,
        full_name: fullName,
        phone: phone,
        email: email,
        event_date: eventDate,
        guests_count: parsedGuests,
        event_type: eventType,
        location: eventAddress,
        event_time: eventTime,
        event_duration: eventDuration || "",
        service_requirements: serviceRequirements || "",
        menu_preferences: menuPreferences || "",
        additional_info: additionalInfo || "",
        message: message || "",
        custom_notes: "",
        status: "new",
        ip_address: clientIp
      }]);

      if (!insertError) {
        insertSuccess = true;
        break;
      }

      // PostgreSQL unique_violation error code = 23505
      const isUniqueViolation = insertError.code === "23505" || 
        (insertError.message && insertError.message.includes("duplicate key"));

      if (isUniqueViolation && attempt < MAX_INSERT_RETRIES - 1) {
        console.warn(`Reference ID collision on '${refId}', retrying (attempt ${attempt + 1}/${MAX_INSERT_RETRIES})...`);
        continue;
      }

      console.error("Supabase insert error:", insertError);
      return new Response(JSON.stringify({ success: false, error: isPl ? "Nie udało się zapisać zapytania." : "Failed to store inquiry." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!insertSuccess) {
      return new Response(JSON.stringify({ success: false, error: isPl ? "Nie udało się zapisać zapytania." : "Failed to store inquiry." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Send emails via Brevo if API key is configured
    if (BREVO_API_KEY && BREVO_SENDER_EMAIL) {
      try {
        const escapedFullName = escapeHtml(fullName);
        const escapedEmail = escapeHtml(email);
        const escapedPhone = escapeHtml(phone);
        const escapedEventDate = escapeHtml(eventDate);
        const escapedEventTime = escapeHtml(eventTime);
        const escapedEventAddress = escapeHtml(eventAddress);
        const escapedEventDuration = escapeHtml(eventDuration || "");
        const escapedGuestsCount = escapeHtml(String(guestsCount));
        const escapedEventType = escapeHtml(eventType);
        const escapedServiceRequirements = escapeHtml(serviceRequirements || "");
        const escapedMenuPreferences = escapeHtml(menuPreferences || "");
        const escapedAdditionalInfo = escapeHtml(additionalInfo || "");
        const escapedMessage = escapeHtml(message || "");
        
        const submittedAt = new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" });

        // A. Send Notification to Admin
        const adminHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-top: 6px solid #1e3a8a; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #1e3a8a; font-size: 22px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
    .header p { color: #b45309; font-size: 12px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .section-title { color: #1e3a8a; font-size: 14px; font-weight: bold; border-left: 3px solid #b45309; padding-left: 10px; margin: 25px 0 15px 0; text-transform: uppercase; font-family: sans-serif; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    .details-table td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .details-table td.label { font-weight: bold; color: #64748b; width: 40%; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
    .details-table td.value { color: #0f172a; width: 60%; }
    .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; font-size: 13px; font-style: italic; line-height: 1.6; font-family: 'Georgia', serif; color: #334155; margin-bottom: 25px; white-space: pre-wrap; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .reply-btn { display: inline-block; background-color: #1e3a8a; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: bold; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Catering Inquiry</h1>
      <p>Reference: ${refId}</p>
    </div>
    
    <div class="section-title">Customer Contact Details</div>
    <table class="details-table">
      <tr>
        <td class="label">Full Name</td>
        <td class="value">${escapedFullName}</td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="value"><a href="mailto:${escapedEmail}">${escapedEmail}</a></td>
      </tr>
      <tr>
        <td class="label">Phone Number</td>
        <td class="value">${escapedPhone}</td>
      </tr>
    </table>

    <div class="section-title">Event Logistics</div>
    <table class="details-table">
      <tr>
        <td class="label">Date of Event</td>
        <td class="value">${escapedEventDate}</td>
      </tr>
      <tr>
        <td class="label">Time of Event</td>
        <td class="value">${escapedEventTime}</td>
      </tr>
      <tr>
        <td class="label">Event Address</td>
        <td class="value">${escapedEventAddress}</td>
      </tr>
      <tr>
        <td class="label">Estimated Duration</td>
        <td class="value">${escapedEventDuration || 'Not specified'}</td>
      </tr>
      <tr>
        <td class="label">Number of Guests</td>
        <td class="value">${escapedGuestsCount}</td>
      </tr>
      <tr>
        <td class="label">Type of Event</td>
        <td class="value">${escapedEventType}</td>
      </tr>
    </table>

    <div class="section-title">Service & Menu Preferences</div>
    <table class="details-table">
      <tr>
        <td class="label">Service Requirements</td>
        <td class="value">${escapedServiceRequirements || 'None specified'}</td>
      </tr>
      <tr>
        <td class="label">Menu Preferences</td>
        <td class="value">${escapedMenuPreferences || 'None specified'}</td>
      </tr>
      <tr>
        <td class="label">Additional Details</td>
        <td class="value">${escapedAdditionalInfo || 'None specified'}</td>
      </tr>
    </table>

    <div class="section-title">Customer Message</div>
    <div class="message-box">${escapedMessage || 'No message provided.'}</div>

    <div class="footer">
      <p>Submitted Date & Time: ${submittedAt} (Warsaw Time)</p>
      <p>Please click Reply to respond directly to the customer.</p>
      <a href="mailto:${escapedEmail}" class="reply-btn">Reply to ${escapedFullName}</a>
    </div>
  </div>
</body>
</html>
        `;

        const rawAdminEmail = ADMIN_INQUIRY_EMAIL;
        const adminEmails = rawAdminEmail.split(",")
          .map(e => e.trim())
          .filter(e => e.length > 0);
          
        const adminRecipients = adminEmails.map(e => ({
          email: e,
          name: "Amaltea Catering Admin"
        }));

        const adminMailPayload = {
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL,
          },
          to: adminRecipients,
          replyTo: {
            email: email,
            name: fullName,
          },
          subject: `New Catering Inquiry from ${fullName}`,
          htmlContent: adminHtmlContent,
        };

        // B. Send Auto-Confirmation to Customer
        const customerHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-top: 6px solid #b45309; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #1e3a8a; font-size: 22px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
    .header p { color: #b45309; font-size: 12px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .welcome-text { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; }
    .details-table td { padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .details-table td.label { font-weight: bold; color: #64748b; width: 40%; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
    .details-table td.value { color: #0f172a; width: 60%; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Amaltea Greek Catering</h1>
      <p>${isPl ? 'Dziękujemy za Zapytanie' : 'We Received Your Inquiry'}</p>
    </div>
    
    <div class="welcome-text">
      ${isPl 
        ? `Dzień dobry, ${escapedFullName}!<br><br>Dziękujemy za kontakt z Amaltea Greek Catering. Z przyjemnością pomożemy Ci zorganizować wyjątkowe wydarzenie kulinarnie inspirowane smakami Morza Egejskiego i basenu Morza Śródziemnego. Nasz zespół eventowy w Warszawie przeanalizuje Twoje zapytanie i skontaktuje się z Tobą telefonicznie jak najszybciej.`
        : `Dear ${escapedFullName},<br><br>Thank you for reaching out to Amaltea Greek Catering. We are delighted at the opportunity to create a memorable Mediterranean feast for your event. Our Warsaw event team is reviewing your requirements and we will contact you as soon as possible.`
      }
    </div>

    <table class="details-table">
      <tr>
        <td class="label">${isPl ? 'Identyfikator' : 'Reference ID'}</td>
        <td class="value" style="font-family: monospace; font-weight: bold; color: #b45309;">${refId}</td>
      </tr>
      <tr>
        <td class="label">${isPl ? 'Typ Wydarzenia' : 'Event Type'}</td>
        <td class="value">${escapedEventType}</td>
      </tr>
      <tr>
        <td class="label">${isPl ? 'Liczba Gości' : 'Guests Count'}</td>
        <td class="value">${escapedGuestsCount}</td>
      </tr>
      <tr>
        <td class="label">${isPl ? 'Planowana Data' : 'Event Date'}</td>
        <td class="value">${escapedEventDate}</td>
      </tr>
      <tr>
        <td class="label">${isPl ? 'Planowana Godzina' : 'Event Time'}</td>
        <td class="value">${escapedEventTime}</td>
      </tr>
      <tr>
        <td class="label">${isPl ? 'Adres Wydarzenia' : 'Event Location'}</td>
        <td class="value">${escapedEventAddress}</td>
      </tr>
    </table>

    <div class="welcome-text">
      ${isPl
        ? `Jeśli chcesz przekazać nam dodatkowe szczegóły, możesz odpowiedzieć bezpośrednio na tę wiadomość.`
        : `If you have any immediate details to add, feel free to reply directly to this email.`
      }
    </div>

    <div class="footer">
      <p>AMALTEA SP. Z O.O. SP. K. | Al. Jana Pawła II 29, Warsaw, Poland</p>
      <p>catering@amaltea.com.pl | +48 503 10 20 90</p>
    </div>
  </div>
</body>
</html>
        `;

        const customerMailPayload = {
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL,
          },
          to: [
            {
              email: email,
              name: fullName,
            },
          ],
          replyTo: {
            email: rawAdminEmail.split(",")[0].trim(),
            name: BREVO_SENDER_NAME,
          },
          subject: isPl ? "Otrzymaliśmy Twoje zapytanie cateringowe" : "We received your catering inquiry",
          htmlContent: customerHtmlContent,
        };

        // Send emails separately and await them
        let adminEmailSent = false;
        let adminEmailErrorMsg = "";
        let adminEmailResponseData = null;

        try {
          console.log(`Sending admin email notification to: ${rawAdminEmail}...`);
          adminEmailResponseData = await sendBrevoEmail(adminMailPayload, BREVO_API_KEY);
          console.log("Admin email delivery response:", JSON.stringify(adminEmailResponseData));
          adminEmailSent = true;
        } catch (adminErr: any) {
          adminEmailErrorMsg = adminErr.message || String(adminErr);
          console.error("Admin email delivery failed:", adminErr);
        }

        // Send customer confirmation if configured
        let customerEmailSent = false;
        try {
          console.log(`Sending customer confirmation email to: ${email}...`);
          const customerEmailResponseData = await sendBrevoEmail(customerMailPayload, BREVO_API_KEY);
          console.log("Customer email delivery response:", JSON.stringify(customerEmailResponseData));
          customerEmailSent = true;
        } catch (customerErr: any) {
          console.error("Customer confirmation email delivery failed:", customerErr);
        }

        // Update database with status
        if (adminEmailSent) {
          const { error: updateError } = await supabase
            .from("inquiries")
            .update({ status: "admin_email_sent" })
            .eq("reference_id", refId);
          if (updateError) {
            console.error("Failed to update status to admin_email_sent:", updateError);
          }
        } else {
          const { error: updateError } = await supabase
            .from("inquiries")
            .update({ 
              status: "admin_email_failed", 
              custom_notes: `Admin email failed: ${adminEmailErrorMsg.substring(0, 200)}` 
            })
            .eq("reference_id", refId);
          if (updateError) {
            console.error("Failed to update status to admin_email_failed:", updateError);
          }
        }

        // If the admin email failed, return a 500 error response
        if (!adminEmailSent) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: isPl 
                ? "Zapytanie zostało zapisane w bazie, lecz wystąpił błąd podczas powiadamiania administratora." 
                : "Inquiry saved in database, but an error occurred while notifying the administrator." 
            }), 
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

      } catch (emailErr: any) {
        console.error("General email service failure:", emailErr);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: isPl 
              ? "Wystąpił nieoczekiwany błąd podczas wysyłania powiadomień e-mail." 
              : "An unexpected error occurred while sending email notifications." 
          }), 
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      console.error("Brevo API key or sender email is missing. Emails not sent.");
      
      // Update database with status
      const { error: updateError } = await supabase
        .from("inquiries")
        .update({ 
          status: "admin_email_failed", 
          custom_notes: "Admin email failed: Brevo API key or sender email configuration env vars missing in edge runtime." 
        })
        .eq("reference_id", refId);
      if (updateError) {
        console.error("Failed to update status to admin_email_failed:", updateError);
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: isPl 
            ? "Zapytanie zostało zapisane w bazie, lecz usługa powiadomień e-mail nie jest skonfigurowana." 
            : "Inquiry saved in database, but the email notification service is not configured." 
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const successMsg = isPl 
      ? `Dzień dobry, ${fullName}! Twoje zapytanie dotyczące wydarzenia (${eventType}) dla ${guestsCount} osób zostało zapisane. Nasz zespół skontaktuje się z Tobą jak najszybciej.`
      : `Kali Mera, ${fullName}! Your inquiry for a ${eventType} with ${guestsCount} guests has been logged. We will contact you as soon as possible.`;

    return new Response(
      JSON.stringify({
        success: true,
        message: successMsg,
        referenceId: refId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("submit-inquiry edge function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
