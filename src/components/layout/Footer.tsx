import Link from "next/link";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="dark border-t border-border/60 bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" aria-label="amazingtraders, accueil">
            <Logo className="text-lg h-15" />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            (+228) 79 92 04 32 <br />
            LOME - TOGO
          </p>
          <SocialLinks className="mt-4" />
        </div>

        <div>
          <h3 className="text-sm font-semibold">⚠ AVERTISSEMENT AUX RISQUES ⚠</h3>
          <p className="mt-3 text-sm text-muted-foreground">
Le trading comporte des risques élevés  et ne convient pas à tout le monde. Veillez lire la {""}
            <Link href="/divulgation-des-risques" className="hover:text-primary text-primary">
              Divulgation des risques.
            </Link>{" "} <br />
            Le contenu de ce site, ne doit pas être interprété comme un moyen de sollicitation.

          </p>
        </div>
<div>
          <h3 className="text-sm font-semibold">DOCUMENTS LEGAUX</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/termes-et-conditions" className="hover:text-primary text-primary">
              Termes et conditions
            </Link></li>
            <li><Link href="/divulgation-des-risques" className="hover:text-primary text-primary">
              Divulgation des risques
            </Link></li>
            <li><Link href="/politique-de-confidentialite" className="hover:text-primary text-primary">
              Politique de confidentialité
            </Link></li>
          </ul>
        </div>


        <div>
          <h3 className="text-sm font-semibold">COMPTE</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-primary text-primary">Se connecter</Link></li>
            <li><Link href="/register" className="hover:text-primary text-primary">S&apos;inscrire</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary text-primary">Tableau de bord</Link></li>
          </ul>
        </div>

        

      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} amazingtraders. Tous droits réservés.
      </div>
    </footer>
  );
}
