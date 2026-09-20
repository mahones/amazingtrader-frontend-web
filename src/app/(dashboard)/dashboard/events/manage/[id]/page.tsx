"use client";

import { use, useEffect, useState } from "react";
import { EventForm } from "@/components/forms/EventForm";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminEvent } from "@/lib/api/admin";
import type { Event } from "@/types/event";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(["admin", "developer"]);
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchAdminEvent(Number(id)).then(setEvent);
  }, [id]);

  if (!event) return <p className="text-muted-foreground">Chargement...</p>;

  return <EventForm event={event} />;
}
