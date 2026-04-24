import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_p3q9grs';
const TEMPLATE_ID = 'template_8gnkn5u';
const PUBLIC_KEY = 'e_aHWsywJrE-gVmSv';

// Initialize EmailJS once at module load. Safe to call multiple times.
let initialized = false;
function ensureInit() {
  if (initialized) return;
  try {
    emailjs.init({ publicKey: PUBLIC_KEY });
    initialized = true;
    console.log('[EmailJS] Initialized with public key:', PUBLIC_KEY);
  } catch (e) {
    console.error('[EmailJS] init() failed:', e);
  }
}

export interface InquiryEmailPayload {
  client_name: string;
  brand_name: string;
  email: string;
  store_url?: string | null;
  budget_range: string;
  project_details: string;
}

/**
 * Sends an inquiry notification to the agency inbox.
 * Fire-and-forget: never throws — failures are logged so the
 * Supabase save / "Received" success state stay untouched.
 *
 * IMPORTANT: Your EmailJS template MUST use these exact variable names
 * inside double curly braces: {{client_name}}, {{brand_name}}, {{email}},
 * {{store_url}}, {{budget_range}}, {{project_details}}, {{submitted_at}}.
 * Set the template's "To Email" to: polished.bd@gmail.com
 * Set "Reply To" to: {{email}}
 */
export async function sendInquiryEmail(
  payload: InquiryEmailPayload,
): Promise<{ ok: boolean; status?: number; text?: string; error?: unknown }> {
  ensureInit();

  const templateParams: Record<string, string> = {
    client_name: payload.client_name,
    brand_name: payload.brand_name,
    email: payload.email,
    reply_to: payload.email,
    from_name: payload.client_name,
    from_email: payload.email,
    store_url: payload.store_url || 'Not provided',
    budget_range: payload.budget_range,
    project_details: payload.project_details,
    submitted_at: new Date().toLocaleString(),
    to_email: 'polished.bd@gmail.com',
  };

  console.log('[EmailJS] Sending inquiry…', {
    serviceId: SERVICE_ID,
    templateId: TEMPLATE_ID,
    templateParams,
  });

  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
    console.log('[EmailJS] ✅ Sent successfully:', res.status, res.text);
    return { ok: true, status: res.status, text: res.text };
  } catch (err) {
    // EmailJS rejects with { status, text } on failure
    const e = err as { status?: number; text?: string; message?: string };
    console.error('[EmailJS] ❌ Failed to send inquiry notification:', {
      status: e?.status,
      text: e?.text,
      message: e?.message,
      raw: err,
    });
    return { ok: false, status: e?.status, text: e?.text || e?.message, error: err };
  }
}
