"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  ChevronDown,
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
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

function useSidebarNavItems() {
  const { user, isStaff } = useAuth();

  const core = [
    { href: "/dashboard", label: "Aperçu", icon: LayoutDashboard },
    { href: "/dashboard/formations", label: "Mes Formations", icon: BookOpen },
    { href: "/dashboard/vip-formations", label: "Formations VIP", icon: Sparkles },
    { href: "/dashboard/auto-trading", label: "Auto-trading", icon: KeyRound },
    { href: "/dashboard/bots", label: "Mes Bots", icon: Bot },
    { href: "/dashboard/barrons-challenges", label: "Challenges Barrons", icon: Trophy },
    { href: "/dashboard/events", label: "Événements", icon: CalendarDays },
  ];

  const programme = [
    ...(isStaff ? [] : [{ href: "/dashboard/partenaire", label: "Espace Partenaire", icon: Handshake }]),
    ...(isStaff || user?.is_community_member
      ? [{ href: "/dashboard/community", label: "Communauté VIP", icon: Crown }]
      : []),
  ];

  const contenu = isStaff
    ? [
        { href: "/dashboard/articles", label: "Articles", icon: FileText },
        { href: "/dashboard/announcements", label: "Annonces", icon: Megaphone },
        { href: "/dashboard/faq", label: "FAQ", icon: HelpCircle },
        { href: "/dashboard/brokers", label: "Courtiers", icon: Building2 },
      ]
    : [];

  const commerce = isStaff
    ? [
        { href: "/dashboard/promo-codes", label: "Codes promo", icon: Percent },
        { href: "/dashboard/partenaires", label: "Partenaires", icon: Handshake },
        { href: "/dashboard/cadeaux", label: "Cadeaux", icon: Gift },
        { href: "/dashboard/retraits", label: "Demandes de retrait", icon: Wallet },
      ]
    : [];

  const administration = isStaff
    ? [
        { href: "/dashboard/avis", label: "Avis clients", icon: MessageSquareText },
        { href: "/dashboard/users", label: "Utilisateurs", icon: Users },
        { href: "/dashboard/historique", label: "Historique", icon: History },
      ]
    : [];

  const compte = [{ href: "/dashboard/settings", label: "Paramètres", icon: Settings }];

  const groups = isStaff
    ? [
        { title: "Général", items: [...core, ...programme] },
        { title: "Contenu", items: contenu },
        { title: "Commerce", items: commerce },
        { title: "Administration", items: administration },
        { title: "Compte", items: compte },
      ]
    : [
        { title: "Mon espace", items: core },
        { title: "Programme", items: programme },
        { title: "Compte", items: compte },
      ];

  return groups.filter((group) => group.items.length > 0);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isStaff, logout } = useAuth();
  const navItems = useSidebarNavItems();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(title: string) {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }

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

      <nav className="flex-1 space-y-4 overflow-y-auto px-3">
        {navItems.map((group) => {
          const isCollapsed = collapsedGroups[group.title];
          return (
            <div key={group.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground"
                aria-expanded={!isCollapsed}
              >
                <span>{group.title}</span>
                <ChevronDown
                  className={`size-3.5 shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>
              {!isCollapsed &&
                group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`ml-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
            </div>
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
