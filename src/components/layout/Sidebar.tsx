"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Crown,
  FileText,
  Gift,
  Handshake,
  HelpCircle,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareText,
  Percent,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

function useSidebarNavItems() {
  const { user, isStaff } = useAuth();

  return [
    { href: "/dashboard", label: "Aperçu", icon: LayoutDashboard },
    { href: "/dashboard/formations", label: "Mes Formations", icon: BookOpen },
    { href: "/dashboard/auto-trading", label: "Auto-trading", icon: KeyRound },
    { href: "/dashboard/bots", label: "Mes Bots", icon: Bot },
    { href: "/dashboard/events", label: "Événements", icon: CalendarDays },
    ...(isStaff ? [] : [{ href: "/dashboard/partenaire", label: "Espace Partenaire", icon: Handshake }]),
    ...(isStaff || user?.is_community_member
      ? [{ href: "/dashboard/community", label: "Communauté VIP", icon: Crown }]
      : []),
    ...(isStaff ? [{ href: "/dashboard/articles", label: "Articles", icon: FileText }] : []),
    ...(isStaff ? [{ href: "/dashboard/announcements", label: "Annonces", icon: Megaphone }] : []),
    ...(isStaff ? [{ href: "/dashboard/faq", label: "FAQ", icon: HelpCircle }] : []),
    ...(isStaff ? [{ href: "/dashboard/brokers", label: "Courtiers", icon: Building2 }] : []),
    ...(isStaff ? [{ href: "/dashboard/promo-codes", label: "Codes promo", icon: Percent }] : []),
    ...(isStaff ? [{ href: "/dashboard/partenaires", label: "Partenaires", icon: Handshake }] : []),
    ...(isStaff ? [{ href: "/dashboard/cadeaux", label: "Cadeaux", icon: Gift }] : []),
    ...(isStaff ? [{ href: "/dashboard/retraits", label: "Demandes de retrait", icon: Wallet }] : []),
    ...(isStaff ? [{ href: "/dashboard/avis", label: "Avis clients", icon: MessageSquareText }] : []),
    ...(isStaff ? [{ href: "/dashboard/users", label: "Utilisateurs", icon: Users }] : []),
    ...(isStaff ? [{ href: "/dashboard/historique", label: "Historique", icon: History }] : []),
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isStaff, logout } = useAuth();
  const navItems = useSidebarNavItems();

  async function handleLogout() {
    if (!window.confirm("Voulez-vous vraiment vous déconnecter ?")) return;
    onNavigate?.();
    await logout();
    router.push("/");
  }

  return (
    <>
      <Link href="/" className="shrink-0 px-6 py-5" aria-label="amazingtraders, accueil" onClick={onNavigate}>
        <Logo themed />
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
        <div className="shrink-0 border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
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
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-background md:flex md:h-screen md:flex-col">
      <SidebarNav />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 gap-0 p-0 md:hidden">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SidebarNav onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
