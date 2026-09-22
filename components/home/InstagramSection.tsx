import { Camera } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";

export function InstagramSection({ username }: { username: string }) {
  return (
    <section className="py-20 sm:py-24 bg-ivory">
      <Container className="text-center">
        <Camera className="h-8 w-8 mx-auto text-rose-500" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-3xl sm:text-4xl text-ink">
          Suivez nos créations au quotidien 💗
        </h2>
        <p className="mt-3 text-ink-light">@{username}</p>
        <div className="mt-7">
          <LinkButton
            href={`https://www.instagram.com/${username}/`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
          >
            Voir Instagram
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
