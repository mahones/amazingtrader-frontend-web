"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { deleteCommunityMessage, fetchCommunityMessages, postCommunityMessage } from "@/lib/api/community";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import { CommunityUpsell } from "./CommunityUpsell";
import { MessageCard } from "./MessageCard";
import { MessageComposer } from "./MessageComposer";
import type { CommunityMessage } from "@/types/community";

const POLL_INTERVAL_MS = 18_000;

function replaceMessage(messages: CommunityMessage[], updated: CommunityMessage): CommunityMessage[] {
  return messages.map((message) => {
    if (message.id === updated.id) return { ...updated, replies: message.replies };
    if (message.replies.some((reply) => reply.id === updated.id)) {
      return { ...message, replies: message.replies.map((reply) => (reply.id === updated.id ? updated : reply)) };
    }
    return message;
  });
}

function removeMessage(messages: CommunityMessage[], id: number): CommunityMessage[] {
  return messages
    .filter((message) => message.id !== id)
    .map((message) => ({ ...message, replies: message.replies.filter((reply) => reply.id !== id) }));
}

export function CommunityFeed() {
  const [messages, setMessages] = useState<CommunityMessage[] | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const poll = useCallback(async () => {
    try {
      const items = await fetchCommunityMessages();
      setMessages(items);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setForbidden(true);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!cancelled) await poll();
    }

    run();
    const interval = setInterval(run, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [poll]);

  async function handlePost(body: string) {
    const created = await postCommunityMessage(body);
    setMessages((prev) => (prev ? [created, ...prev] : [created]));
  }

  async function handleReply(parentId: number, body: string) {
    const created = await postCommunityMessage(body, parentId);
    setMessages((prev) =>
      prev
        ? prev.map((message) =>
            message.id === parentId ? { ...message, replies: [...message.replies, created] } : message
          )
        : prev
    );
  }

  function handleReactionChange(updated: CommunityMessage) {
    setMessages((prev) => (prev ? replaceMessage(prev, updated) : prev));
  }

  async function handleDelete(id: number) {
    try {
      await deleteCommunityMessage(id);
      setMessages((prev) => (prev ? removeMessage(prev, id) : prev));
    } catch (error) {
      toast.error(extractApiError(error, "Impossible de supprimer ce message."));
    }
  }

  if (forbidden) return <CommunityUpsell />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-4">
        <MessageComposer onSubmit={handlePost} />
      </div>

      {messages === null && <p className="text-sm text-muted-foreground">Chargement...</p>}
      {messages?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun message pour le moment. Soyez le premier à publier !
        </p>
      )}
      {messages?.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onReactionChange={handleReactionChange}
          onDelete={handleDelete}
          onReply={(body) => handleReply(message.id, body)}
        />
      ))}
    </div>
  );
}
