import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="dark border-t border-border/60 bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" aria-label="amazingtraders, accueil">
            <Logo className="text-lg" />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Formations, licences d&apos;auto-trading et bots pour trader plus intelligemment.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Plateforme</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/formations" className="hover:text-primary">Formations</Link></li>
            <li><Link href="/auto-trading" className="hover:text-primary">Auto-trading</Link></li>
            <li><Link href="/bot-trading" className="hover:text-primary">Bot de trading</Link></li>
            <li><Link href="/articles" className="hover:text-primary">Articles</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Compte</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-primary">Se connecter</Link></li>
            <li><Link href="/register" className="hover:text-primary">S&apos;inscrire</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Tableau de bord</Link></li>
          </ul>
        </div>

      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} amazingtraders. Tous droits réservés.
      </div>
    </footer>
  );
}
