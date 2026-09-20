import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime, stripHtml } from "@/lib/utils";
import type { Event } from "@/types/event";

export function EventCard({ event, manageHref }: { event: Event; manageHref?: string }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      {event.image_url && (
        <div className="px-(--card-spacing)">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
            <img src={event.image_url} alt={event.title} className="size-full object-cover" />
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{formatDateTime(event.starts_at)}</span>
          {manageHref && (
            <Badge variant={event.is_published ? "default" : "secondary"}>
              {event.is_published ? "Publié" : "Brouillon"}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-1 text-lg">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(event.content)}</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {manageHref && (
          <Button size="sm" variant="outline" render={<Link href={manageHref}>Gérer</Link>} />
        )}
        <Button size="sm" render={<Link href={`/dashboard/events/${event.slug}`}>Voir l&apos;événement</Link>} />
      </CardFooter>
    </Card>
  );
}
