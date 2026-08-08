import type { ReactNode } from "react";

export function LegalPageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {intro && (
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {intro}
          </p>
        )}

        <div
          className="mt-10 space-y-5
            [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:first:mt-0
            [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-muted-foreground
            [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_ol]:text-muted-foreground
            [&_li]:leading-relaxed
            [&_li::marker]:text-primary [&_li::marker]:font-semibold
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
