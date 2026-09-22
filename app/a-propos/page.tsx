import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "À propos",
  description: "L'histoire de Crochet by Ahlem, une petite marque algérienne de créations faites à la main.",
};

export default function AboutPage() {
  return (
    <Container className="py-14 sm:py-20 max-w-3xl">
      <p className="text-sm font-medium text-rose-500 mb-3">Notre histoire</p>
      <h1 className="font-display text-4xl text-ink">Fait main avec amour 💗</h1>

      <div className="relative aspect-[16/9] rounded-[var(--radius-card)] bg-rose-100 overflow-hidden my-8">
        <Image src="/demo/bouquet-fleurs.svg" alt="" fill className="object-cover p-16" />
      </div>

      <div className="prose-boutique space-y-5 text-ink-light leading-relaxed">
        <p>
          Crochet by Ahlem est né d&apos;une passion simple : celle du fil, de
          l&apos;aiguille et du temps qu&apos;on prend pour bien faire les choses.
          Chaque création commence par une idée, un carnet de croquis, un choix
          de couleurs, avant de devenir une pièce unique tissée maille après
          maille.
        </p>
        <p>
          Ahlem crée des amigurumis, des poupées, des bouquets éternels, des
          accessoires et bien d&apos;autres petites merveilles, toutes pensées
          pour durer et pour raconter une histoire — la vôtre.
        </p>
        <p>
          Ce qui rend chaque pièce spéciale, c&apos;est justement qu&apos;elle
          n&apos;est jamais tout à fait comme une autre. Le fait main a ses
          irrégularités, et c&apos;est précisément ce qui en fait tout le
          charme.
        </p>
        <p>
          Aujourd&apos;hui, Crochet by Ahlem accompagne les moments importants :
          un anniversaire, une naissance, un mariage, ou simplement l&apos;envie
          de s&apos;offrir quelque chose de doux et d&apos;unique.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <LinkButton href="/creations">Découvrir les créations</LinkButton>
        <LinkButton href="/personnalise" variant="secondary">
          Créer une commande personnalisée
        </LinkButton>
      </div>
    </Container>
  );
}
