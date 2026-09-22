import { Container, SectionHeading } from "@/components/ui/primitives";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getDeliveryZones } from "@/services/delivery";
import { getSettings } from "@/services/settings";

export const metadata = { title: "Ma commande" };

export default async function CheckoutPage() {
  const [deliveryZones, settings] = await Promise.all([getDeliveryZones(), getSettings()]);

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading eyebrow="Dernière étape" title="Finaliser ma commande" className="mb-10" />
      <CheckoutForm deliveryZones={deliveryZones} settings={settings} />
    </Container>
  );
}
