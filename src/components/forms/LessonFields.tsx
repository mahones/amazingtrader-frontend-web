"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export interface LessonDraft {
  title: string;
  video_id: string;
  description: string;
  is_preview: boolean;
}

export const EMPTY_LESSON_DRAFT: LessonDraft = {
  title: "",
  video_id: "",
  description: "",
  is_preview: false,
};

export function LessonFields({
  value,
  onChange,
  idPrefix = "lesson",
}: {
  value: LessonDraft;
  onChange: (next: LessonDraft) => void;
  idPrefix?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Titre de la leçon</Label>
        <Input
          id={`${idPrefix}-title`}
          required
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-video`}>ID vidéo Vimeo</Label>
        <Input
          id={`${idPrefix}-video`}
          value={value.video_id}
          onChange={(e) => onChange({ ...value, video_id: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <RichTextEditor
          value={value.description}
          onChange={(html) => onChange({ ...value, description: html })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id={`${idPrefix}-preview`}
          checked={value.is_preview}
          onCheckedChange={(checked) => onChange({ ...value, is_preview: checked })}
        />
        <Label htmlFor={`${idPrefix}-preview`}>Leçon d&apos;aperçu gratuite</Label>
      </div>
    </div>
  );
}
