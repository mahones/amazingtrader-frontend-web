import Link from "next/link";
import { Clock, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Course } from "@/types/course";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          {course.category && <Badge variant="secondary">{course.category}</Badge>}
          <Badge className="gap-1">
            <Signal className="size-3" />
            {LEVEL_LABELS[course.level] ?? course.level}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
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
