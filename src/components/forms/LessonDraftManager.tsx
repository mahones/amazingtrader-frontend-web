"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EMPTY_LESSON_DRAFT, LessonFields, type LessonDraft } from "./LessonFields";

export function LessonDraftManager({
  lessons,
  onChange,
}: {
  lessons: LessonDraft[];
  onChange: (next: LessonDraft[]) => void;
}) {
  const [current, setCurrent] = useState<LessonDraft>(EMPTY_LESSON_DRAFT);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function resetForm() {
    setCurrent(EMPTY_LESSON_DRAFT);
    setEditingIndex(null);
  }

  function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!current.title.trim()) return;

    if (editingIndex !== null) {
      const next = [...lessons];
      next[editingIndex] = current;
      onChange(next);
    } else {
      onChange([...lessons, current]);
    }
    resetForm();
  }

  function handleEdit(index: number) {
    setCurrent(lessons[index]);
    setEditingIndex(index);
  }

  function handleRemove(index: number) {
    onChange(lessons.filter((_, i) => i !== index));
    if (editingIndex === index) resetForm();
  }

  return (
    <div className="space-y-4">
      {lessons.length > 0 && (
        <ul className="divide-y divide-border">
          {lessons.map((lesson, index) => (
            <li key={index} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>
                {index + 1}. {lesson.title || "(sans titre)"}
              </span>
              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(index)}>
                  Modifier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleRemove(index)}>
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-md border border-border p-4">
        <p className="mb-3 text-sm font-medium">
          {editingIndex !== null ? `Modifier la leçon ${editingIndex + 1}` : "Ajouter une leçon"}
        </p>
        <LessonFields value={current} onChange={setCurrent} idPrefix={`draft-lesson-${editingIndex ?? "new"}`} />
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={handleAddOrUpdate}>
            {editingIndex !== null ? "Mettre à jour la leçon" : "Ajouter la leçon"}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Annuler
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
