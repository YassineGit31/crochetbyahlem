import { notFound } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";
import { getOrderByNumber } from "@/services/orders";
import { getSettings } from "@/services/settings";
import { buildOrderWhatsAppMessage, buildWaLink } from "@/lib/whatsapp";
import { formatDZD } from "@/lib/utils";

export const metadata = { title: "Commande confirmée" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [order, settings] = await Promise.all([
    getOrderByNumber(decodeURIComponent(orderNumber)),
    getSettings(),
  ]);
  if (!order) notFound();

  const waLink = buildWaLink(settings.whatsapp_number, buildOrderWhatsAppMessage(order));

  return (
    <Container className="py-16 sm:py-20 max-w-2xl">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl text-ink">
          Merci pour votre commande 💗
        </h1>
        <p className="mt-3 text-ink-light">Votre commande a bien été enregistrée.</p>
        <p className="mt-4 inline-block rounded-full bg-ivory border border-rose-200 px-5 py-2 font-display text-lg text-rose-600">
          #{order.order_number}
        </p>
      </div>

      <div className="mt-10 rounded-[var(--radius-card)] bg-ivory border border-rose-100 p-6">
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-3">
              {item.product_image && (
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-rose-50">
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover p-1.5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">
                  {item.quantity}x {item.product_name}
                </p>
                {(item.options.color || item.options.size) && (
                  <p className="text-xs text-ink-light">
                    {[item.options.color, item.options.size].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold text-rose-600 shrink-0">
                {formatDZD(item.line_total)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-5 border-t border-rose-100 space-y-2 text-sm">
          <div className="flex justify-between text-ink-light">
            <span>Sous-total</span>
            <span className="text-ink">{formatDZD(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-light">
            <span>Livraison</span>
            <span className="text-ink">
              {order.delivery_fee === 0 ? "Gratuite" : formatDZD(order.delivery_fee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-rose-100">
            <span>Total</span>
            <span className="text-rose-600">{formatDZD(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-ink-light">
        Nous allons vous contacter pour confirmer votre commande et les détails de livraison.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href={waLink} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          Contacter Crochet by Ahlem sur WhatsApp
        </LinkButton>
        <LinkButton href="/creations" variant="secondary" size="lg">
          Continuer mes achats
        </LinkButton>
      </div>
    </Container>
  );
}
