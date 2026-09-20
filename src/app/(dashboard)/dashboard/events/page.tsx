"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/cards/EventCard";
import { useAuth } from "@/context/AuthContext";
import { fetchAdminEvents } from "@/lib/api/admin";
import { fetchEvents } from "@/lib/api/events";
import type { Event } from "@/types/event";

export default function DashboardEventsPage() {
  const { isStaff } = useAuth();
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    (isStaff ? fetchAdminEvents() : fetchEvents()).then(setEvents);
  }, [isStaff]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Événements</h1>
          <p className="text-muted-foreground">
            {isStaff ? "Gérez les événements du tableau de bord." : "Les prochains événements à ne pas manquer."}
          </p>
        </div>
        {isStaff && (
          <Button render={<Link href="/dashboard/events/new"><Plus className="mr-1 size-4" /> Nouvel événement</Link>} />
        )}
      </div>

      {events === null && <p className="text-muted-foreground">Chargement...</p>}
      {events?.length === 0 && <p className="text-muted-foreground">Aucun événement pour le moment.</p>}
      {events && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              manageHref={isStaff ? `/dashboard/events/manage/${event.id}` : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
