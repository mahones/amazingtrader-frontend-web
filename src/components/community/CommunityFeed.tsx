"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  deleteCommunityMessage,
  fetchCommunityMembers,
  fetchCommunityMessages,
  pinCommunityMessage,
  postCommunityMessage,
} from "@/lib/api/community";
import { extractApiError } from "@/lib/api/client";
import { toast } from "@/lib/toast";
import { CommunityUpsell } from "./CommunityUpsell";
import { MessageCard } from "./MessageCard";
import { MessageComposer, type ComposerSubmission } from "./MessageComposer";
import type { CommunityMember, CommunityMessage } from "@/types/community";

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
  const [members, setMembers] = useState<CommunityMember[]>([]);
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

  useEffect(() => {
    fetchCommunityMembers().then(setMembers).catch(() => {});
  }, []);

  async function handlePost(payload: ComposerSubmission) {
    const created = await postCommunityMessage({
      body: payload.body,
      linkUrl: payload.linkUrl,
      linkLabel: payload.linkLabel,
      image: payload.image,
      files: payload.files,
    });
    setMessages((prev) => (prev ? [created, ...prev] : [created]));
  }

  async function handleReply(parentId: number, payload: ComposerSubmission) {
    const created = await postCommunityMessage({
      body: payload.body,
      parentId,
      linkUrl: payload.linkUrl,
      linkLabel: payload.linkLabel,
      image: payload.image,
      files: payload.files,
    });
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

  async function handlePin(id: number, pinned: boolean) {
    try {
      const updated = await pinCommunityMessage(id, pinned);
      setMessages((prev) => (prev ? replaceMessage(prev, updated) : prev));
    } catch (error) {
      toast.error(extractApiError(error, "Impossible de mettre à jour l'épinglage."));
    }
  }

  if (forbidden) return <CommunityUpsell />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-4">
        <MessageComposer onSubmit={handlePost} members={members} />
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
          members={members}
          onReactionChange={handleReactionChange}
          onDelete={handleDelete}
          onReply={(payload) => handleReply(message.id, payload)}
          onPin={handlePin}
        />
      ))}
    </div>
  );
}
