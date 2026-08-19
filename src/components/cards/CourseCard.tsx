import Link from "next/link";
import { Clock, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, stripHtml } from "@/lib/utils";
import { LEVEL_BADGE_CLASSES, LEVEL_LABELS } from "@/lib/course-level";
import type { Course } from "@/types/course";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      {course.thumbnail_url && (
        <div className="px-(--card-spacing)">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host not known at build time */}
            <img src={course.thumbnail_url} alt={course.title} className="size-full object-cover" />
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          {course.category && <Badge variant="secondary">{course.category}</Badge>}
          <Badge className={`gap-1 ${LEVEL_BADGE_CLASSES[course.level] ?? ""}`}>
            <Signal className="size-3" />
            {LEVEL_LABELS[course.level] ?? course.level}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(course.description)}</p>
        <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {Math.round(course.duration_minutes / 60)}h de formation
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{formatCurrency(course.price)}</span>
        <Button size="sm" render={<Link href={`/formations/${course.slug}`}>Voir la formation</Link>} />
      </CardFooter>
    </Card>
  );
}
