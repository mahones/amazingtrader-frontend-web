"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api/client";
import { createAdminBotFiles, deleteAdminBotFile } from "@/lib/api/admin";
import type { BotFile } from "@/types/bot";

function formatSize(bytes: number | null) {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function BotFilesManager({
  botId,
  files,
  onChange,
}: {
  botId: number;
  files: BotFile[];
  onChange: (next: BotFile[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const selected = fileInputRef.current?.files;
    if (!selected || selected.length === 0) return;

    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(selected).forEach((file, index) => {
        formData.append(`files[${index}]`, file);
        formData.append(`labels[${index}]`, label || file.name);
      });
      const created = await createAdminBotFiles(botId, formData);
      onChange(created);
      setLabel("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(extractApiError(err, "Impossible d'ajouter le(s) fichier(s)."));
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    await deleteAdminBotFile(id);
    onChange(files.filter((f) => f.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fichiers du bot ({files.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div>
                <p className="font-medium">{file.label}</p>
                <p className="text-xs text-muted-foreground">
                  {file.original_filename} {file.size_bytes !== null && `· ${formatSize(file.size_bytes)}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm("Supprimer ce fichier ?")) handleDelete(file.id);
                }}
              >
                Supprimer
              </Button>
            </li>
          ))}
          {files.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Aucun fichier pour le moment.</p>
          )}
        </ul>

        <form onSubmit={handleAdd} className="space-y-3 border-t border-border pt-4">
          <div className="space-y-2">
            <Label htmlFor="bot-file-label">Libellé (optionnel)</Label>
            <Input
              id="bot-file-label"
              placeholder="Ex : Fichier .set MT4"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bot-file-input">Fichier(s)</Label>
            <Input id="bot-file-input" ref={fileInputRef} type="file" multiple />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Envoi..." : "Ajouter"}
          </Button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
