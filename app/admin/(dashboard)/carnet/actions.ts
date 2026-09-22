"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PersonalOrderStatus } from "@/types";
import {
  createPersonalOrder,
  updatePersonalOrder,
  updatePersonalOrderStatus,
  deletePersonalOrder,
  addPersonalOrderPayment,
  PersonalOrderInput,
} from "@/services/personalOrders";

function readInput(formData: FormData): PersonalOrderInput {
  const totalAmount = Number(formData.get("total_amount"));
  const deadlineRaw = formData.get("deadline_days");
  const deadlineDays = deadlineRaw && String(deadlineRaw).trim() !== "" ? Number(deadlineRaw) : null;
  const notes = String(formData.get("notes") ?? "").trim();

  return {
    client_name: String(formData.get("client_name") ?? "").trim(),
    client_phone: String(formData.get("client_phone") ?? "").trim(),
    order_date: String(formData.get("order_date") ?? new Date().toISOString().slice(0, 10)),
    total_amount: Number.isFinite(totalAmount) ? totalAmount : 0,
    deadline_days: deadlineDays !== null && Number.isFinite(deadlineDays) ? deadlineDays : null,
    notes: notes || null,
  };
}

export async function createPersonalOrderAction(formData: FormData) {
  const input = readInput(formData);
  if (!input.client_name || !input.client_phone) {
    throw new Error("Le nom et le numéro du client sont obligatoires.");
  }
  const order = await createPersonalOrder(input);
  revalidatePath("/admin/carnet");
  redirect(`/admin/carnet/${order.id}`);
}

export async function updatePersonalOrderAction(id: string, formData: FormData) {
  const input = readInput(formData);
  if (!input.client_name || !input.client_phone) {
    throw new Error("Le nom et le numéro du client sont obligatoires.");
  }
  await updatePersonalOrder(id, input);
  revalidatePath("/admin/carnet");
  revalidatePath(`/admin/carnet/${id}`);
}

export async function updatePersonalOrderStatusAction(id: string, status: PersonalOrderStatus) {
  await updatePersonalOrderStatus(id, status);
  revalidatePath("/admin/carnet");
  revalidatePath(`/admin/carnet/${id}`);
}

export async function deletePersonalOrderAction(id: string) {
  await deletePersonalOrder(id);
  revalidatePath("/admin/carnet");
  redirect("/admin/carnet");
}

export async function addPersonalOrderPaymentAction(id: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Montant invalide.");
  }
  await addPersonalOrderPayment(id, amount, note || undefined);
  revalidatePath(`/admin/carnet/${id}`);
}
