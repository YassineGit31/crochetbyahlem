import { PersonalOrderForm } from "@/components/admin/PersonalOrderForm";
import { createPersonalOrderAction } from "../actions";

export const metadata = { title: "Nouvelle commande — Mon Carnet" };

export default function NewPersonalOrderPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Nouvelle commande</h1>
      <PersonalOrderForm action={createPersonalOrderAction} submitLabel="Enregistrer la commande" />
    </div>
  );
}
