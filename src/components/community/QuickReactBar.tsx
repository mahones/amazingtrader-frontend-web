"use client";

import { cn } from "@/lib/utils";
import { removeCommunityReaction, setCommunityReaction } from "@/lib/api/community";
import { QUICK_REACT_EMOJIS, type CommunityMessage } from "@/types/community";

export function QuickReactBar({
  message,
  onChange,
}: {
  message: CommunityMessage;
  onChange: (updated: CommunityMessage) => void;
}) {
  async function handleClick(emoji: string) {
    const updated =
      message.reactions.my_reaction === emoji
        ? await removeCommunityReaction(message.id)
        : await setCommunityReaction(message.id, emoji);
    onChange(updated);
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {QUICK_REACT_EMOJIS.map((emoji) => {
        const count = message.reactions.counts[emoji] ?? 0;
        const isMine = message.reactions.my_reaction === emoji;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
              isMine
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
