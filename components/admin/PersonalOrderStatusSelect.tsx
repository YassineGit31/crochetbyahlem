"use client";

import { useState, useTransition } from "react";
import { PersonalOrderStatus, PERSONAL_ORDER_STATUS_LABELS } from "@/types";

export function PersonalOrderStatusSelect({
  orderId,
  status,
  action,
}: {
  orderId: string;
  status: PersonalOrderStatus;
  action: (id: string, status: PersonalOrderStatus) => Promise<void>;
}) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as PersonalOrderStatus;
          setValue(next);
          startTransition(() => {
            action(orderId, next);
          });
        }}
        className="input w-auto"
      >
        {(Object.keys(PERSONAL_ORDER_STATUS_LABELS) as PersonalOrderStatus[]).map((s) => (
          <option key={s} value={s}>
            {PERSONAL_ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-ink-faint">Enregistrement...</span>}
    </div>
  );
}
