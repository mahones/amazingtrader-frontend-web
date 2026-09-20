"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { EventSidebar } from "@/components/events/EventSidebar";
import { fetchEvent } from "@/lib/api/events";
import { sanitizeContentHtml } from "@/lib/sanitize-content-html";
import type { Event } from "@/types/event";

export default function DashboardEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null | undefined>(undefined);

  useEffect(() => {
    fetchEvent(slug)
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [slug]);

  if (event === undefined) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (event === null) {
    notFound();
  }

  const sanitizedContent = sanitizeContentHtml(event.content);

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <article className="lg:col-span-2">
        <h1 className="text-3xl font-bold sm:text-4xl">{event.title}</h1>
        {event.image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
            <img src={event.image_url} alt={event.title} className="size-full object-cover" />
          </div>
        )}
        <div
          className="mt-8 max-w-none space-y-4 leading-relaxed text-foreground/90 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_p]:leading-relaxed [&_img]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>

      <EventSidebar event={event} />
    </div>
  );
}
