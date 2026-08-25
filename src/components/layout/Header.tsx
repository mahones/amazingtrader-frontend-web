"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Menu, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

const TELEGRAM_URL = "https://t.me/+Y27TJtoHhdNlZDQ0";

function TelegramButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      render={
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Rejoindre notre Telegram">
          <Send className="size-5 text-primary" />
        </a>
      }
    />
  );
}

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/formations", label: "Formations" },
  { href: "/auto-trading", label: "Auto-trading" },
  { href: "/bot-trading", label: "Bots de trading" },
  { href: "/brokers", label: "Courtiers" },
  { href: "/articles", label: "Articles" },
  { href: "/lexique", label: "Lexique" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    if (!window.confirm("Voulez-vous vraiment vous déconnecter ?")) return;
    await logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="dark border-b border-border/60 bg-background text-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="amazingtraders, accueil">
          <Logo className="text-lg" />
        </Link> 

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <TelegramButton />
          {!isLoading && user ? (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                Déconnexion
              </Button>
              <Button render={<Link href="/dashboard">Tableau de bord</Link>} />
            </>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login">Se connecter</Link>} />
              <Button render={<Link href="/register">S&apos;inscrire</Link>} />
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <TelegramButton />
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {!isLoading && user ? (
                <>
                  <Button variant="ghost" className="flex-1" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                  <Button className="flex-1" render={<Link href="/dashboard">Tableau de bord</Link>} />
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    render={<Link href="/login">Se connecter</Link>}
                  />
                  <Button className="flex-1" render={<Link href="/register">S&apos;inscrire</Link>} />
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
