import { cn } from "@/lib/utils";
import { formatDZD } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container-boutique", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "rose",
  className,
}: {
  children: React.ReactNode;
  tone?: "rose" | "gold" | "sage" | "ink";
  className?: string;
}) {
  const tones: Record<string, string> = {
    rose: "bg-rose-100 text-rose-700",
    gold: "bg-[#f3e6c8] text-[#6b5527]",
    sage: "bg-[#e4e9df] text-[#4c5943]",
    ink: "bg-ink/[0.06] text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PriceTag({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("font-display text-lg text-rose-600", className)}>
      {formatDZD(amount)}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center mx-auto" : "", "max-w-xl", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-medium text-rose-500">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{title}</h2>
      {description && (
        <p className="mt-3 text-ink-light leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-[var(--radius-card)] bg-ivory border border-rose-100">
      {icon && <div className="mb-4 text-rose-400">{icon}</div>}
      <p className="font-display text-xl text-ink">{title}</p>
      {description && <p className="mt-2 text-ink-light max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
