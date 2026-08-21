import { notFound } from "next/navigation";
import { Clock, Lock, PlayCircle, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import { formatCurrency } from "@/lib/utils";
import { getCourse } from "@/lib/api/server";
import { LEVEL_BADGE_CLASSES, LEVEL_LABELS } from "@/lib/course-level";
import { sanitizeContentHtml } from "@/lib/sanitize-content-html";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug).catch(() => null);

  if (!course) {
    notFound();
  }

  const sanitizedDescription = sanitizeContentHtml(course.description);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            {course.category && <Badge variant="secondary">{course.category}</Badge>}
            <Badge className={`gap-1 ${LEVEL_BADGE_CLASSES[course.level] ?? ""}`}>
              <Signal className="size-3" />
              {LEVEL_LABELS[course.level] ?? course.level}
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.title}</h1>

          {course.thumbnail_url && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          <div
            className="mt-4 max-w-none space-y-4 leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {Math.round(course.duration_minutes / 60)}h de contenu
          </div>

          {course.program && course.program.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Programme détaillé</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {course.program.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {course.lessons && course.lessons.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contenu de la formation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {course.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="flex items-center gap-2">
                        {lesson.is_preview ? (
                          <PlayCircle className="size-4 text-primary" />
                        ) : (
                          <Lock className="size-4 text-muted-foreground" />
                        )}
                        {lesson.title}
                      </span>
                      {lesson.duration_seconds && (
                        <span className="text-muted-foreground">
                          {Math.round(lesson.duration_seconds / 60)} min
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{formatCurrency(course.price)}</div>
              <p className="mt-1 text-sm text-muted-foreground">Accès à vie à la formation</p>
              <div className="mt-6">
                <PurchaseButton type="course" id={course.id} label="Souscrire à cette formation" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
