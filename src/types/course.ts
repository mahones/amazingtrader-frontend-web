export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type VideoProvider = "vimeo" | "mux";

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  position: number;
  description: string | null;
  video_provider: VideoProvider | null;
  video_id: string | null;
  embed_url: string | null;
  duration_seconds: number | null;
  resources: { label: string; url: string }[] | null;
  is_preview: boolean;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  category: string | null;
  price: number;
  duration_minutes: number;
  program: string[] | null;
  thumbnail_url: string | null;
  is_published: boolean;
  lessons?: Lesson[];
  enrollment_count?: number;
  created_at: string;
}

export interface Enrollment {
  id: number;
  progress_percent: number;
  completed_lessons: number[];
  enrolled_at: string | null;
  course: Course;
}
