import { MessageCircleMore } from "lucide-react";
import { MarketTicker } from "./MarketTicker";

const WHATSAPP_URL = "https://wa.me/22879920432";

export function TopBar() {
  return (
    <div className="flex items-stretch border-b border-border bg-background text-foreground">
      <div className="min-w-0 flex-1">
        <MarketTicker />
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-1.5 border-l border-border px-4 text-sm font-bold whitespace-nowrap text-foreground transition-colors hover:text-primary"
      >
        <MessageCircleMore className="size-4 text-primary" />
        (228) 79920432
      </a>
    </div>
  );
}
