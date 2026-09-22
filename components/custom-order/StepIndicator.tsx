import { cn } from "@/lib/utils";

const STEPS = ["Inspiration", "Votre idée", "Personnalisation", "Livraison", "Confirmation"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div>
      <div className="hidden sm:flex items-center justify-between mb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1.5 text-center w-full">
              <span
                className={cn(
                  "font-display text-sm h-8 w-8 rounded-full flex items-center justify-center border",
                  i < current
                    ? "bg-rose-500 border-rose-500 text-ivory"
                    : i === current
                    ? "border-rose-500 text-rose-600"
                    : "border-rose-200 text-ink-faint"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("text-xs", i === current ? "text-ink font-medium" : "text-ink-faint")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px flex-1 -mx-1", i < current ? "bg-rose-400" : "bg-rose-100")} />
            )}
          </div>
        ))}
      </div>
      <div className="sm:hidden">
        <p className="text-sm font-medium text-ink mb-2">
          Étape {current + 1} / {STEPS.length} — {STEPS[current]}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-rose-100 overflow-hidden">
        <div
          className="h-full bg-rose-500 transition-all duration-300"
          style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
