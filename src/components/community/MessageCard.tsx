"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { MessageComposer } from "./MessageComposer";
import { QuickReactBar } from "./QuickReactBar";
import type { CommunityMessage } from "@/types/community";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function MessageCard({
  message,
  isReply = false,
  onReactionChange,
  onDelete,
  onReply,
}: {
  message: CommunityMessage;
  isReply?: boolean;
  onReactionChange: (updated: CommunityMessage) => void;
  onDelete: (id: number) => void;
  onReply?: (body: string) => Promise<void>;
}) {
  const [isReplying, setIsReplying] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Supprimer ce message ?")) return;
    onDelete(message.id);
  }

  return (
    <div className={isReply ? "flex gap-3" : "flex gap-3 rounded-lg border border-border p-4"}>
      <Avatar size={isReply ? "sm" : "default"}>
        <AvatarFallback>{initials(message.author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{message.author.name}</span>
          {message.author.is_staff && <Badge variant="outline">Staff</Badge>}
          <span className="text-xs text-muted-foreground">{formatDateTime(message.created_at)}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
        <div className="flex flex-wrap items-center gap-3">
          <QuickReactBar message={message} onChange={onReactionChange} />
          {!isReply && onReply && (
            <button
              type="button"
              onClick={() => setIsReplying((v) => !v)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Répondre
            </button>
          )}
          {message.can_delete && (
            <Button variant="ghost" size="icon-xs" onClick={handleDelete} className="text-muted-foreground">
              <Trash2 className="size-3.5" />
              <span className="sr-only">Supprimer</span>
            </Button>
          )}
        </div>

        {!isReply && isReplying && onReply && (
          <MessageComposer
            placeholder={`Répondre à ${message.author.name}...`}
            submitLabel="Répondre"
            autoFocus
            onSubmit={async (body) => {
              await onReply(body);
              setIsReplying(false);
            }}
          />
        )}

        {!isReply && message.replies.length > 0 && (
          <div className="space-y-3 border-l border-border pl-4">
            {message.replies.map((reply) => (
              <MessageCard
                key={reply.id}
                message={reply}
                isReply
                onReactionChange={onReactionChange}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
