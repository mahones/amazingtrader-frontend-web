"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

      <div className="grid gap-4">
        {faqs === null && <p className="text-muted-foreground">Chargement...</p>}
        {faqs?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucune question pour le moment.
            </CardContent>
          </Card>
        )}
        {faqs?.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{faq.question}</h3>
                  {faq.category && <Badge variant="outline">{faq.category}</Badge>}
                  {faq.is_featured && <Badge>Mise en avant</Badge>}
                  {!faq.is_active && <Badge variant="secondary">Masquée</Badge>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <FaqDialog
                  faq={faq}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" onClick={() => handleDelete(faq.id)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
