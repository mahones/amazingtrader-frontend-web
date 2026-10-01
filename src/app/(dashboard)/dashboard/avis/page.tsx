"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogCard, CatalogCardGrid } from "@/components/dashboard/CatalogListCard";
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

      {reviews === null && <p className="text-muted-foreground">Chargement...</p>}
      {reviews?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun avis pour le moment.
          </CardContent>
        </Card>
      )}
      <CatalogCardGrid>
        {reviews?.map((review) => (
          <CatalogCard
            key={review.id}
            title={review.title}
            caption={
              <>
                <p className="whitespace-pre-wrap">{review.content}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">
                  {review.user && `Par ${review.user.name} (${review.user.email}) · `}
                  {formatDate(review.created_at)}
                </p>
              </>
            }
          />
        ))}
      </CatalogCardGrid>
    </div>
  );
}
