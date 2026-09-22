import { Container } from "@/components/ui/primitives";

const ITEMS = [
  { emoji: "🧶", label: "Fait main" },
  { emoji: "💗", label: "Créé avec amour" },
  { emoji: "✨", label: "Commandes personnalisées" },
  { emoji: "🚚", label: "Livraison disponible" },
  { emoji: "⏳", label: "Délai : environ 20 jours ou plus selon la commande" },
];

export function TrustBadges() {
  return (
    <div className="border-y border-rose-100 bg-ivory">
      <Container className="py-6">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ink-light">
          {ITEMS.map((item) => (
            <li key={item.label} className="inline-flex items-center gap-2">
              <span aria-hidden>{item.emoji}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
