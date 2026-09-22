import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(amount))} DA`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** CB-AH-2026-0042 style, using a short random tail (final zero-padded sequence
 *  is assigned server-side from the DB sequence when Supabase is configured). */
export function formatOrderNumber(year: number, sequence: number): string {
  return `CB-AH-${year}-${String(sequence).padStart(4, "0")}`;
}

export function formatCustomRequestNumber(year: number, sequence: number): string {
  return `CUSTOM-${year}-${String(sequence).padStart(4, "0")}`;
}

/** Fallback client-side reference generator, used only in demo mode
 *  when there is no database sequence to draw from. */
export function generateFallbackSequence(): number {
  return Math.floor(1 + Math.random() * 9998);
}

export function isValidAlgerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, "");
  return /^(0)(5|6|7)[0-9]{8}$/.test(cleaned);
}

export function formatDate(dateISO: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateISO));
}

export function formatDateShort(dateISO: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateISO));
}

/** For "Mon Carnet": order_date + deadline_days -> the promised delivery date. */
export function computeDeadlineDate(orderDateISO: string, deadlineDays: number | null): Date | null {
  if (deadlineDays === null) return null;
  const d = new Date(orderDateISO);
  d.setDate(d.getDate() + deadlineDays);
  return d;
}

/** Days remaining until the deadline (negative = overdue). Null if no deadline set. */
export function daysUntil(date: Date | null): number | null {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
