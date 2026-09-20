"use client";

import { EventForm } from "@/components/forms/EventForm";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function NewEventPage() {
  useRequireRole(["admin", "developer"]);

  return <EventForm />;
}
