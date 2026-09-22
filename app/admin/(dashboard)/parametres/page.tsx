import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/services/settings";

export const metadata = { title: "Paramètres" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Paramètres</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
