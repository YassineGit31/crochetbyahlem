import {
  CustomRequest,
  Order,
  CREATION_TYPE_LABELS,
  OCCASION_LABELS,
} from "@/types";
import { formatDZD, formatDateShort } from "./utils";
import { SIZE_OPTIONS } from "./constants";

function sizeLabel(size: string): string {
  return SIZE_OPTIONS.find((s) => s.value === size)?.label ?? size;
}

/** Builds the structured WhatsApp text for a standard product order. */
export function buildOrderWhatsAppMessage(order: Order): string {
  const lines: string[] = [];
  lines.push("🧶 NOUVELLE COMMANDE — CROCHET BY AHLEM");
  lines.push("");
  lines.push(`Commande: #${order.order_number}`);
  lines.push("");
  lines.push("👤 CLIENT");
  lines.push(`Nom: ${order.customer_name}`);
  lines.push(`Téléphone: ${order.customer_phone}`);
  lines.push(`Wilaya: ${order.wilaya}`);
  lines.push(`Commune: ${order.commune}`);
  lines.push(`Adresse: ${order.address}`);
  if (order.delivery_instructions) {
    lines.push(`Indications: ${order.delivery_instructions}`);
  }
  lines.push("");
  lines.push("🛍️ COMMANDE");
  lines.push("");
  for (const item of order.items) {
    lines.push(`${item.quantity}x ${item.product_name}`);
    if (item.options?.color) lines.push(`Couleur: ${item.options.color}`);
    if (item.options?.size) lines.push(`Taille: ${item.options.size}`);
    if (item.options?.variantLabel) lines.push(`Option: ${item.options.variantLabel}`);
    if (item.options?.note) lines.push(`Note: ${item.options.note}`);
    lines.push(`Prix: ${formatDZD(item.line_total)}`);
    lines.push("");
  }
  lines.push(`Sous-total: ${formatDZD(order.subtotal)}`);
  lines.push(`Livraison: ${order.delivery_fee > 0 ? formatDZD(order.delivery_fee) : "Gratuite"}`);
  lines.push(`💰 TOTAL: ${formatDZD(order.total)}`);
  if (order.notes) {
    lines.push("");
    lines.push("📝 NOTE:");
    lines.push(order.notes);
  }
  return lines.join("\n");
}

/** Builds the structured WhatsApp text for a custom creation request. */
export function buildCustomRequestWhatsAppMessage(
  request: CustomRequest,
  imageUrls: string[]
): string {
  const lines: string[] = [];
  lines.push("🧶 NOUVELLE DEMANDE PERSONNALISÉE");
  lines.push("");
  lines.push(`Référence: ${request.request_number}`);
  lines.push("");
  lines.push("👤 CLIENT");
  lines.push(`Nom: ${request.customer_name}`);
  lines.push(`Téléphone: ${request.customer_phone}`);
  lines.push(`Wilaya: ${request.wilaya}`);
  lines.push(`Commune: ${request.commune}`);
  lines.push(`Adresse: ${request.address}`);
  lines.push("");
  lines.push("✨ PROJET");
  lines.push("");
  lines.push(`Type: ${CREATION_TYPE_LABELS[request.creation_type]}`);
  lines.push("");
  lines.push("Description:");
  lines.push(request.description);
  lines.push("");
  if (request.colors.length > 0) {
    lines.push(`🎨 COULEURS: ${request.colors.join(", ")}`);
  }
  lines.push(
    `📏 TAILLE: ${sizeLabel(request.size)}${
      request.custom_dimensions ? ` (${request.custom_dimensions})` : ""
    }`
  );
  lines.push(`🔢 QUANTITÉ: ${request.quantity}`);
  lines.push(`🎁 OCCASION: ${OCCASION_LABELS[request.occasion]}`);
  if (request.desired_date) {
    lines.push(`📅 DATE SOUHAITÉE: ${formatDateShort(request.desired_date)}`);
  }
  if (request.budget) {
    lines.push(`💰 BUDGET: ${formatDZD(request.budget)}`);
  }
  if (imageUrls.length > 0) {
    lines.push("");
    lines.push("📸 INSPIRATIONS:");
    imageUrls.forEach((url) => lines.push(url));
  }
  if (request.notes) {
    lines.push("");
    lines.push("📝 NOTES:");
    lines.push(request.notes);
  }
  return lines.join("\n");
}

/** Normalizes an Algerian number (local or international) to digits-only, international format. */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("213")) return digits;
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  return digits;
}

/** Builds a wa.me deep link. The WhatsApp number always comes from store settings,
 *  never hardcoded at each call site. */
export function buildWaLink(whatsappNumber: string, message: string): string {
  const number = normalizeWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
