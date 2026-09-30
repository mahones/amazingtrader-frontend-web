"use client";

import { useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractApiError } from "@/lib/api/client";
import { createAdminBarronsChallengeFiles, deleteAdminBarronsChallengeFile } from "@/lib/api/admin";
import type { BarronsChallengeFile } from "@/types/barronsChallenge";

function formatSize(bytes: number | null) {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Files uploaded here live on the CHALLENGE itself (not a specific buyer's
 * license) — every buyer sees the same set once their own license is
 * activated. See BarronsChallengeFilePolicy on the backend.
 */
export function BarronsChallengeFilesManager({
  challengeId,
  files,
  onChange,
}: {
  challengeId: number;
  files: BarronsChallengeFile[];
  onChange: (next: BarronsChallengeFile[]) => void;
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
      const created = await createAdminBarronsChallengeFiles(challengeId, formData);
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
    await deleteAdminBarronsChallengeFile(id);
    onChange(files.filter((f) => f.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fichiers du challenge ({files.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ces fichiers sont partagés par tous les acheteurs — ils ne deviennent visibles pour un
          acheteur qu&apos;une fois sa licence activée.
        </p>
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
                variant="destructive"
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
            <Label htmlFor="barrons-file-label">Libellé (optionnel)</Label>
            <Input
              id="barrons-file-label"
              placeholder="Ex : Règlement du challenge"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barrons-file-input">Fichier(s)</Label>
            <Input id="barrons-file-input" ref={fileInputRef} type="file" multiple />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Envoi..." : "Ajouter"}
          </Button>
        </form>
        {error && <Alert variant="error">{error}</Alert>}
      </CardContent>
    </Card>
  );
}
