import { cn } from "@/lib/utils";

/** Champ de saisie des écrans d'authentification (maquette : 48px, coins arrondis, fond de page). */
export const authFieldClass =
  "h-12 data-[size=default]:h-12 rounded-xl border-input bg-background px-4 text-base placeholder:text-muted-foreground/70 dark:border-[#3A3A3A] dark:bg-background";

/** Bouton principal plein orange, pleine largeur. */
export const authButtonClass = "h-12 w-full rounded-xl text-base font-semibold";

export const authLinkClass = "font-medium text-primary hover:underline";

export function AuthCard({
  title,
  subtitle,
  badge,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  /** Pastille au-dessus du titre (ex. « ACCÈS ADMINISTRATEUR »). */
  badge?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-10 dark:border-[#2C2C2C]",
        wide ? "max-w-2xl" : "max-w-md"
      )}
    >
      {badge && (
        <span className="mb-5 inline-flex rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold tracking-wider text-primary dark:bg-[#3A2810]">
          {badge}
        </span>
      )}
      <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
