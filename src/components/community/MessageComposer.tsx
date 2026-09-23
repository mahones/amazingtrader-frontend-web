"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Link2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/api/client";
import { formatFileSize } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { CommunityMember } from "@/types/community";

export interface ComposerSubmission {
  body: string;
  linkUrl?: string;
  linkLabel?: string;
  image?: File | null;
  files?: File[];
}

export function MessageComposer({
  onSubmit,
  members = [],
  placeholder = "Publiez quelque chose pour la communauté...",
  submitLabel = "Publier",
  autoFocus = false,
}: {
  onSubmit: (payload: ComposerSubmission) => Promise<void>;
  members?: CommunityMember[];
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkFields, setShowLinkFields] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mentionMatches =
    mentionQuery !== null
      ? members.filter((m) => m.name.toLowerCase().includes(mentionQuery.toLowerCase())).slice(0, 5)
      : [];

  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setBody(value);

    const cursor = e.target.selectionStart ?? value.length;
    const upToCursor = value.slice(0, cursor);
    const atIndex = upToCursor.lastIndexOf("@");

    if (atIndex === -1 || /\s/.test(upToCursor.slice(atIndex + 1))) {
      setMentionQuery(null);
      setMentionStart(null);
      return;
    }

    setMentionQuery(upToCursor.slice(atIndex + 1));
    setMentionStart(atIndex);
  }

  function handleSelectMention(member: CommunityMember) {
    if (mentionStart === null) return;
    const cursor = textareaRef.current?.selectionStart ?? body.length;
    const before = body.slice(0, mentionStart);
    const after = body.slice(cursor);
    const next = `${before}@${member.name} ${after}`;
    setBody(next);
    setMentionQuery(null);
    setMentionStart(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function resetComposer() {
    setBody("");
    setShowLinkFields(false);
    setLinkUrl("");
    setLinkLabel("");
    setImage(null);
    setFiles([]);
  }

  async function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed || isSubmitting) return;
    if (linkUrl.trim() && !linkLabel.trim()) {
      toast.error("Donnez un nom au lien avant de publier.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        body: trimmed,
        linkUrl: linkUrl.trim() || undefined,
        linkLabel: linkLabel.trim() || undefined,
        image,
        files,
      });
      resetComposer();
    } catch (error) {
      toast.error(extractApiError(error, "Impossible d'envoyer le message."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={handleBodyChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={3}
        />
        {mentionMatches.length > 0 && (
          <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-lg border border-border bg-popover p-1 shadow-md">
            {mentionMatches.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectMention(member)}
                className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                {member.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {showLinkFields && (
        <div className="flex flex-wrap gap-2">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1"
          />
          <Input
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            placeholder="Nom du lien"
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setShowLinkFields(false);
              setLinkUrl("");
              setLinkLabel("");
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {image && (
        <div className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm">
          <ImageIcon className="size-4 text-muted-foreground" />
          <span className="flex-1 truncate">{image.name}</span>
          <Button type="button" variant="ghost" size="icon-xs" onClick={() => setImage(null)}>
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm">
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="size-4" />
            <span className="sr-only">Ajouter une image</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
          />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="size-4" />
            <span className="sr-only">Joindre un fichier</span>
          </Button>

          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowLinkFields((v) => !v)}>
            <Link2 className="size-4" />
            <span className="sr-only">Ajouter un lien</span>
          </Button>
        </div>

        <Button size="sm" disabled={!body.trim() || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
