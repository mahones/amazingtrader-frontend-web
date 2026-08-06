import type { CourseLevel } from "@/types/course";

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export const LEVEL_BADGE_CLASSES: Record<CourseLevel, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  intermediate: "bg-primary/10 text-primary dark:bg-primary/15",
  advanced: "bg-destructive/10 text-destructive dark:bg-destructive/20",
};
