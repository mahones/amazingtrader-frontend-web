"use client";

import { MessageCircleMore, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43C21.99 8.94 22 9.3 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47C15.06 21.99 14.7 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44.54C6.08.29 6.81.12 7.87.07 8.94.01 9.3 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.34 1.17 1.17 0 0 0 0 2.34Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-1.39 4.28 4.28 0 0 1-1.11-2.93h-3.4v13.75a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 2.59-2.59c.24 0 .48.03.7.1v-3.45a5.94 5.94 0 0 0-.7-.04A5.99 5.99 0 0 0 .38 17.68a5.99 5.99 0 0 0 5.99 5.99 5.99 5.99 0 0 0 5.99-5.99V9.42a7.63 7.63 0 0 0 4.46 1.43V7.4a4.25 4.25 0 0 1-.22-1.58z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

const COMMUNITY_LINKS = [
  {
    name: "whatsapp",
    label: "Chaîne WhatsApp",
    href: "https://whatsapp.com/channel/0029VbBOvS55a240W5cVIb1w",
    icon: <MessageCircleMore className="size-4" />,
  },
  {
    name: "telegram",
    label: "Canal Télégram",
    href: "https://t.me/+Y27TJtoHhdNlZDQ0",
    icon: <Send className="size-4" />,
  },
  {
    name: "tiktok",
    label: "Compte TikTok Officiel",
    href: "https://www.tiktok.com/@amazing.traders?_r=1&_t=ZT-993CCX6yqzN",
    icon: <TiktokIcon />,
  },
  {
    name: "facebook",
    label: "Page Facebook Officielle",
    href: "https://www.facebook.com/share/198CW4nHsa/",
    icon: <FacebookIcon />,
  },
  {
    name: "instagram",
    label: "Compte Instagram Officiel",
    href: "https://www.instagram.com/amazing.traders?igsi=MWpvdmVrdTV3amN2bA==",
    icon: <InstagramIcon />,
  },
  {
    name: "youtube",
    label: "Chaîne YouTube",
    href: "https://youtube.com/@amazing.traders?si=r3hhCYyr25zWNHG6",
    icon: <YoutubeIcon />,
  },
];

export function CommunityMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" />
        }
      >
        <Users className="size-4" />
        <span className="hidden sm:inline">Rejoindre la communauté</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-1.5 py-1">
          <span className="text-xs font-medium text-muted-foreground">Rejoindre la communauté</span>
        </div>
        <DropdownMenuSeparator />
        {COMMUNITY_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.name}
            render={<a href={link.href} target="_blank" rel="noopener noreferrer" />}
            className="gap-2"
          >
            <span className="text-primary">{link.icon}</span>
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
