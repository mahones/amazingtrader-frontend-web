import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stripHtml } from "@/lib/utils";
import type { BarronsChallenge } from "@/types/barronsChallenge";

export function BarronsChallengeCard({ challenge }: { challenge: BarronsChallenge }) {
  const cardImage = challenge.preview_image ?? challenge.image_url;
  const cardExcerpt = challenge.excerpt ?? stripHtml(challenge.description);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      {cardImage && (
        <div className="px-(--card-spacing)">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
            <img src={cardImage} alt={challenge.name} className="size-full object-cover" />
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-1">
          {challenge.pairs_traded.map((pair) => (
            <Badge key={pair} variant="secondary">{pair}</Badge>
          ))}
        </div>
        <CardTitle className="mt-2 text-lg">{challenge.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 text-sm text-muted-foreground">{cardExcerpt}</p>
      </CardContent>
    </Card>
  );
}
