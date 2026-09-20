"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnnouncementDialog } from "@/components/admin/AnnouncementDialog";
import { useRequireRole } from "@/hooks/useRequireRole";
import { deleteAdminAnnouncement, fetchAdminAnnouncements } from "@/lib/api/admin";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { Announcement } from "@/types/announcement";

export default function DashboardAnnouncementsPage() {
  useRequireRole(["admin", "developer"]);

  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);

  async function reload() {
    const refreshed = await fetchAdminAnnouncements();
    setAnnouncements(refreshed);
  }

  useEffect(() => {
    void reload();
  }, []);

  function handleSaved(announcement: Announcement) {
    setAnnouncements((prev) => {
      if (!prev) return [announcement];
      const exists = prev.some((a) => a.id === announcement.id);
      return exists ? prev.map((a) => (a.id === announcement.id ? announcement : a)) : [announcement, ...prev];
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer définitivement cette annonce ?")) return;
    try {
      await deleteAdminAnnouncement(id);
      setAnnouncements((prev) => prev?.filter((a) => a.id !== id) ?? null);
      toast.success("Annonce supprimée.");
    } catch {
      toast.error("Impossible de supprimer cette annonce.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Annonces</h1>
          <p className="text-muted-foreground">
            Les annonces épinglées s&apos;affichent dans le tableau de bord de tous les utilisateurs.
          </p>
        </div>
        <AnnouncementDialog
          onSaved={handleSaved}
          trigger={
            <Button>
              <Plus className="mr-1 size-4" /> Nouvelle annonce
            </Button>
          }
        />
      </div>

      <div className="grid gap-4">
        {announcements === null && <p className="text-muted-foreground">Chargement...</p>}
        {announcements?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucune annonce pour le moment.
            </CardContent>
          </Card>
        )}
        {announcements?.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  {announcement.is_pinned ? (
                    <Badge>Épinglée</Badge>
                  ) : (
                    <Badge variant="secondary">Désépinglée</Badge>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{announcement.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(announcement.created_at)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <AnnouncementDialog
                  announcement={announcement}
                  onSaved={handleSaved}
                  trigger={
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" onClick={() => handleDelete(announcement.id)}>
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
