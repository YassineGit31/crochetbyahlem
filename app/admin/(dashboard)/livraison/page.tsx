import { DeliveryZonesManager } from "@/components/admin/DeliveryZonesManager";
import { getAllDeliveryZones } from "@/services/delivery";

export const metadata = { title: "Livraison" };

export default async function AdminDeliveryPage() {
  const zones = await getAllDeliveryZones();
  return <DeliveryZonesManager zones={zones} />;
}
