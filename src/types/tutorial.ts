export interface Tutorial {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  youtube_url: string;
  is_published: boolean;
  published_at: string | null;
}
