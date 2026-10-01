"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
import { FaqDialog } from "@/components/admin/FaqDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminFaq, fetchAdminFaqs } from "@/lib/api/admin";
import { toast } from "@/lib/toast";
import type { Faq } from "@/types/faq";

export default function DashboardFaqPage() {
  useRequireRole(["admin", "developer"]);

  const [faqs, setFaqs] = useState<Faq[] | null>(null);

  async function reload() {
    const refreshed = await fetchAdminFaqs();
    setFaqs(refreshed);
  }

  useEffect(() => {
    void reload();
  }, []);

  function handleSaved(faq: Faq) {
    setFaqs((prev) => {
      if (!prev) return [faq];
      const exists = prev.some((f) => f.id === faq.id);
      return exists ? prev.map((f) => (f.id === faq.id ? faq : f)) : [...prev, faq];
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement cette question ?")) return;
    try {
      await deleteAdminFaq(id);
      setFaqs((prev) => prev?.filter((f) => f.id !== id) ?? null);
      toast.success("Question supprimée.");
    } catch {
      toast.error("Impossible de supprimer cette question.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foire aux questions</h1>
          <p className="text-muted-foreground">
            Gérez les questions affichées sur la page FAQ et celles mises en avant sur l&apos;accueil.
          </p>
        </div>
        <FaqDialog
          onSaved={handleSaved}
          trigger={
            <Button>
              <Plus className="mr-1 size-4" /> Nouvelle question
            </Button>
          }
        />
      </div>

      {faqs === null && <p className="text-muted-foreground">Chargement...</p>}
      {faqs?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucune question pour le moment.
          </CardContent>
        </Card>
      )}
      <CatalogCardGrid>
        {faqs?.map((faq) => (
          <CatalogCard
            key={faq.id}
            title={faq.question}
            badges={
              <>
                {faq.category && <Badge variant="outline">{faq.category}</Badge>}
                {faq.is_featured && <Badge>Mise en avant</Badge>}
                {!faq.is_active && <Badge variant="secondary">Masquée</Badge>}
              </>
            }
            caption={<p className="line-clamp-2">{faq.answer}</p>}
            actions={
              <>
                <FaqDialog
                  faq={faq}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(faq.id)}
                >
                  Supprimer
                </Button>
              </>
            }
          />
        ))}
      </CatalogCardGrid>
    </div>
  );
}
