"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminReviews } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types/review";

export default function DashboardReviewsPage() {
  useRequireRole(["admin", "developer"]);

  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetchAdminReviews().then(setReviews);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avis clients</h1>
        <p className="text-muted-foreground">Retrouvez ici les avis laissés par les utilisateurs de la plateforme.</p>
      </div>

      <div className="grid gap-4">
        {reviews === null && <p className="text-muted-foreground">Chargement...</p>}
        {reviews?.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun avis pour le moment.
            </CardContent>
          </Card>
        )}
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardContent className="space-y-2 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold">{review.title}</p>
                <p className="shrink-0 text-xs text-muted-foreground/70">{formatDate(review.created_at)}</p>
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{review.content}</p>
              {review.user && (
                <p className="text-xs text-muted-foreground/70">
                  Par {review.user.name} ({review.user.email})
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
