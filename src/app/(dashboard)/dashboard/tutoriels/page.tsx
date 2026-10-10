"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Link2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminTutorials } from "@/lib/api/admin";
import type { Tutorial } from "@/types/tutorial";

export default function DashboardTutorialsPage() {
  useRequireRole(["admin", "developer"]);
  const [tutorials, setTutorials] = useState<Tutorial[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminTutorials().then(setTutorials);
  }, []);

  async function copyLink(path: string) {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(path);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copiez ce lien :", url);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tutoriels</h1>
          <p className="text-muted-foreground">
            Ces pages ne sont pas liées sur le site : partagez leur lien aux personnes concernées.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => copyLink("/tutoriels")}>
            {copied === "/tutoriels" ? <Check className="mr-1 size-4" /> : <Link2 className="mr-1 size-4" />}
            {copied === "/tutoriels" ? "Lien copié" : "Copier le lien de la liste"}
          </Button>
          <Button render={<Link href="/dashboard/tutoriels/new"><Plus className="mr-1 size-4" /> Nouveau tutoriel</Link>} />
        </div>
      </div>

      {tutorials === null && <p className="text-muted-foreground">Chargement...</p>}
      {tutorials?.length === 0 && <p className="text-muted-foreground">Aucun tutoriel créé.</p>}
      <CatalogCardGrid>
        {tutorials?.map((tutorial) => {
          const path = `/tutoriels/${tutorial.slug}`;
          return (
            <CatalogCard
              key={tutorial.id}
              title={tutorial.title}
              badges={
                <Badge variant={tutorial.is_published ? "default" : "secondary"}>
                  {tutorial.is_published ? "Publié" : "Brouillon"}
                </Badge>
              }
              caption={tutorial.description ?? undefined}
              actions={
                <>
                  <Button variant="outline" size="sm" onClick={() => copyLink(path)}>
                    {copied === path ? "Lien copié" : "Copier le lien"}
                  </Button>
                  <Button variant="outline" size="sm" render={<Link href={path}>Voir la page</Link>} />
                  <Button size="sm" render={<Link href={`/dashboard/tutoriels/${tutorial.id}`}>Gérer</Link>} />
                </>
              }
            />
          );
        })}
      </CatalogCardGrid>
    </div>
  );
}
