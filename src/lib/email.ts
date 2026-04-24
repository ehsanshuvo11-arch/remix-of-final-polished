import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_p3q9grs';
const TEMPLATE_ID = 'template_8gnkn5u';
const PUBLIC_KEY = 'e_aHWsywJrE-gVmSv';

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
 */
export async function sendInquiryEmail(payload: InquiryEmailPayload): Promise<void> {
  try {
    const templateParams = {
      client_name: payload.client_name,
      brand_name: payload.brand_name,
      email: payload.email,
      reply_to: payload.email,
      store_url: payload.store_url || 'Not provided',
      budget_range: payload.budget_range,
      project_details: payload.project_details,
      submitted_at: new Date().toLocaleString(),
      to_email: 'polished.bd@gmail.com',
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
  } catch (err) {
    console.error('[EmailJS] Failed to send inquiry notification:', err);
  }
}
