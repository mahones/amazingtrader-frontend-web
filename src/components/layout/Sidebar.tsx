"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isStaff, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Aperçu", icon: LayoutDashboard },
    { href: "/dashboard/formations", label: "Mes Formations", icon: BookOpen },
    { href: "/dashboard/licences", label: "Mes Licences", icon: KeyRound },
    { href: "/dashboard/bots", label: "Mes Bots", icon: Bot },
    ...(isStaff ? [{ href: "/dashboard/articles", label: "Articles", icon: FileText }] : []),
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <aside className="hidden w-64 shrink-0 self-start border-r border-border/60 bg-background md:sticky md:top-0 md:flex md:h-screen md:flex-col">
      <Link href="/" className="px-6 py-5" aria-label="amazingtraders, accueil">
        <Logo themed />
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
          Connecté en tant que <span className="font-medium text-foreground">{user.name}</span>
          <div className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            {user.role === "user" ? "Membre" : user.role === "admin" ? "Administrateur" : "Développeur"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start gap-2 px-0 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-4" /> Se déconnecter
          </Button>
        </div>
      )}
    </aside>
  );
}
