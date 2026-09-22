import "server-only";

const GRAPH_API_VERSION = "v21.0";

export function isWhatsAppCloudApiConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID
  );
}

async function callGraphApi(body: Record<string, unknown>) {
  const phoneNumberId = process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WhatsApp Cloud API error (${res.status}): ${text}`);
  }
  return res.json();
}

/** Sends a plain text message to a given phone number (international format, no +). */
export async function sendWhatsAppText(to: string, message: string) {
  if (!isWhatsAppCloudApiConfigured()) {
    throw new Error("WhatsApp Cloud API n'est pas configuré.");
  }
  return callGraphApi({ to, type: "text", text: { body: message } });
}

/** Sends an image (from a public URL) with an optional caption. */
export async function sendWhatsAppImage(to: string, imageUrl: string, caption?: string) {
  if (!isWhatsAppCloudApiConfigured()) {
    throw new Error("WhatsApp Cloud API n'est pas configuré.");
  }
  return callGraphApi({ to, type: "image", image: { link: imageUrl, caption } });
}

/**
 * Best-effort notification to the shop's own WhatsApp number when a new
 * custom request (with inspiration images) comes in. Never throws — a
 * failure here must not block the request from being saved, since the
 * customer-facing confirmation page's wa.me link already covers the same
 * information as a graceful fallback.
 */
export async function notifyShopOfCustomRequest(
  shopWhatsAppNumber: string,
  message: string,
  imageUrls: string[]
) {
  if (!isWhatsAppCloudApiConfigured()) return;
  try {
    await sendWhatsAppText(shopWhatsAppNumber, message);
    for (const url of imageUrls.slice(0, 10)) {
      await sendWhatsAppImage(shopWhatsAppNumber, url);
    }
  } catch (err) {
    console.error("notifyShopOfCustomRequest:", err);
  }
}
