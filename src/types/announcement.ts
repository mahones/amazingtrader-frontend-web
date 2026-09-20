export interface Announcement {
  id: number;
  title: string;
  description: string;
  is_pinned: boolean;
  created_at: string;
  author?: { id: number; name: string } | null;
}
