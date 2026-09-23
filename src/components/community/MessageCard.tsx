"use client";

import { useState } from "react";
import { ExternalLink, Paperclip, Pin, PinOff, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadCommunityAttachment } from "@/lib/api/community";
import { formatDateTime, formatFileSize } from "@/lib/utils";
import { MessageComposer, type ComposerSubmission } from "./MessageComposer";
import { QuickReactBar } from "./QuickReactBar";
import { renderMessageBody } from "./renderMessageBody";
import type { CommunityMember, CommunityMessage } from "@/types/community";

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
  members = [],
  isReply = false,
  onReactionChange,
  onDelete,
  onReply,
  onPin,
}: {
  message: CommunityMessage;
  members?: CommunityMember[];
  isReply?: boolean;
  onReactionChange: (updated: CommunityMessage) => void;
  onDelete: (id: number) => void;
  onReply?: (payload: ComposerSubmission) => Promise<void>;
  onPin?: (id: number, pinned: boolean) => Promise<void>;
}) {
  const [isReplying, setIsReplying] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Supprimer ce message ?")) return;
    onDelete(message.id);
  }

  const memberNames = members.map((m) => m.name);

  return (
    <div
      className={
        isReply
          ? "flex gap-3"
          : `flex gap-3 rounded-lg border p-4 ${message.is_pinned ? "border-primary/50 bg-primary/5" : "border-border"}`
      }
    >
      <Avatar size={isReply ? "sm" : "default"}>
        <AvatarImage src={message.author.avatar_url ?? undefined} alt="" />
        <AvatarFallback>{initials(message.author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{message.author.name}</span>
          {message.author.is_staff && <Badge variant="outline">Staff</Badge>}
          {message.is_pinned && <Badge>Épinglé</Badge>}
          <span className="text-xs text-muted-foreground">{formatDateTime(message.created_at)}</span>
        </div>

        <p className="text-sm whitespace-pre-wrap">{renderMessageBody(message.body, memberNames)}</p>

        {message.image_url && (
          <a href={message.image_url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image_url}
              alt=""
              className="max-h-72 rounded-lg border border-border object-cover"
            />
          </a>
        )}

        {message.link_url && (
          <a
            href={message.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-primary hover:bg-muted"
          >
            <ExternalLink className="size-3.5" />
            {message.link_label ?? message.link_url}
          </a>
        )}

        {message.attachments.length > 0 && (
          <div className="space-y-1">
            {message.attachments.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                onClick={() => downloadCommunityAttachment(attachment)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                <Paperclip className="size-3.5 text-muted-foreground" />
                <span className="truncate">{attachment.original_filename}</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size_bytes)}</span>
              </button>
            ))}
          </div>
        )}

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
          {message.can_pin && onPin && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPin(message.id, !message.is_pinned)}
              className="text-muted-foreground"
            >
              {message.is_pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
              <span className="sr-only">{message.is_pinned ? "Désépingler" : "Épingler"}</span>
            </Button>
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
            members={members}
            onSubmit={async (payload) => {
              await onReply(payload);
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
                members={members}
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
