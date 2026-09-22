import { PersonalOrder } from "@/types";
import { Button } from "@/components/ui/Button";

export function PersonalOrderForm({
  action,
  order,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  order?: PersonalOrder;
  submitLabel: string;
}) {
  return (
    <form action={action} className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Nom du client</label>
          <input
            name="client_name"
            required
            defaultValue={order?.client_name}
            className="input"
            placeholder="Ex: Samira B."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Numéro de téléphone</label>
          <input
            name="client_phone"
            required
            defaultValue={order?.client_phone}
            className="input"
            placeholder="0551223344"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Date de la commande</label>
          <input
            type="date"
            name="order_date"
            required
            defaultValue={order?.order_date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">
            Délai promis (en jours)
          </label>
          <input
            type="number"
            min={0}
            name="deadline_days"
            defaultValue={order?.deadline_days ?? ""}
            className="input"
            placeholder="Ex: 5 ou 10"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Montant total à payer (DA)</label>
          <input
            type="number"
            min={0}
            step="1"
            name="total_amount"
            required
            defaultValue={order?.total_amount ?? ""}
            className="input"
            placeholder="Ex: 4500"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink mb-1.5 block">Notes (optionnel)</label>
        <textarea
          name="notes"
          defaultValue={order?.notes ?? ""}
          rows={3}
          className="input"
          placeholder="Détails du modèle, couleur, taille..."
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
