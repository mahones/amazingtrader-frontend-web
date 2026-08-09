import { Button } from "@/components/ui/button";

const DEFAULT_WHATSAPP_URL =
  "https://wa.me/22879920432?text=je%20souhaite%20b%C3%A9n%C3%A9ficier%20du%20service%20auto%20trading.";

export function ContactCtaSection({
  title = "Prêt à confier vos comptes à notre équipe d'experts ?",
  subtitle = "Contactez-nous dès maintenant pour démarrer votre auto-trading en toute sérénité.",
  buttonLabel = "Contactez-nous",
  whatsappUrl = DEFAULT_WHATSAPP_URL,
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  whatsappUrl?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="mt-3 text-primary-foreground/80">{subtitle}</p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-6"
          render={
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              {buttonLabel}
            </a>
          }
        />
      </div>
    </section>
  );
}
