import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";
import { getSettings } from "@/services/settings";
import { buildWaLink } from "@/lib/whatsapp";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  const waLink = buildWaLink(
    settings.whatsapp_number,
    "Bonjour Crochet by Ahlem 👋 J'aimerais avoir quelques informations."
  );

  return (
    <Container className="py-14 sm:py-20 max-w-xl text-center">
      <p className="text-sm font-medium text-rose-500 mb-3">Contact</p>
      <h1 className="font-display text-4xl text-ink">Parlons de votre projet</h1>
      <p className="mt-4 text-ink-light leading-relaxed">
        La façon la plus rapide de nous joindre est WhatsApp. Nous répondons
        généralement dans la journée.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href={waLink} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          Écrire sur WhatsApp
        </LinkButton>
        <LinkButton
          href={`https://www.instagram.com/${settings.instagram_username}/`}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="lg"
        >
          Nous écrire sur Instagram
        </LinkButton>
      </div>
      <p className="mt-10 text-sm text-ink-faint">
        Pour une idée de création sur-mesure, utilisez plutôt notre{" "}
        <a href="/personnalise" className="text-rose-500 underline">
          formulaire de commande personnalisée
        </a>{" "}
        — vous pourrez y joindre vos inspirations.
      </p>
    </Container>
  );
}
