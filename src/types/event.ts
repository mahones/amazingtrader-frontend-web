export interface Event {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  starts_at: string;
  location: string | null;
  meeting_link: string | null;
  is_published: boolean;
  author?: { id: number; name: string } | null;
}
