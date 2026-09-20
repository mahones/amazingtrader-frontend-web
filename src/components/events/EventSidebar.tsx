import { CalendarDays, MapPin, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { Event } from "@/types/event";

export function EventSidebar({ event }: { event: Event }) {
  return (
    <aside className="sticky top-20 self-start space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date et heure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 text-sm">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{formatDateTime(event.starts_at)}</span>
          </div>
        </CardContent>
      </Card>

      {event.location && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lieu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{event.location}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {event.meeting_link && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Réunion en ligne</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <Video className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="break-all">{event.meeting_link}</span>
            </div>
            <Button
              size="sm"
              className="w-full"
              render={
                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                  Rejoindre la réunion
                </a>
              }
            />
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
