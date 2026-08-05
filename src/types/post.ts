export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author?: { id: number; name: string } | null;
}
