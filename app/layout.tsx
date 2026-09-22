import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { getSettings } from "@/services/settings";

export const metadata: Metadata = {
  metadataBase: new URL("https://crochetbyahlem.example"),
  title: {
    default: "Crochet by Ahlem | Créations crochetées à la main",
    template: "%s | Crochet by Ahlem",
  },
  description:
    "Découvrez les créations artisanales de Crochet by Ahlem : amigurumis, bouquets, accessoires et créations personnalisées faites à la main avec amour.",
  openGraph: {
    title: "Crochet by Ahlem",
    description:
      "Découvrez les créations artisanales de Crochet by Ahlem : amigurumis, bouquets, accessoires et créations personnalisées faites à la main avec amour.",
    url: "https://crochetbyahlem.example",
    siteName: "Crochet by Ahlem",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet by Ahlem",
    description: "Créations crochetées à la main, imaginées avec amour.",
  },
  icons: {
    icon: "/logo-mark.svg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer instagramUsername={settings.instagram_username} />
        <CartDrawer />
        <MobileBottomBar whatsappNumber={settings.whatsapp_number} />
      </body>
    </html>
  );
}
