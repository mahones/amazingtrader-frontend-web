import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function CatalogCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function CatalogCard({
  media,
  title,
  badges,
  caption,
  actions,
}: {
  media?: ReactNode;
  title: ReactNode;
  badges?: ReactNode;
  caption?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex h-full flex-col gap-3 pt-6">
        {media}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{title}</h3>
          {badges && <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-1.5">{badges}</div>}
        </div>
        {caption && <div className="text-sm text-muted-foreground">{caption}</div>}
        {actions && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1 [&>*]:flex-1 [&_[data-slot=button]]:w-full">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
