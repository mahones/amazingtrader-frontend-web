export interface Review {
  id: number;
  title: string;
  content: string;
  user?: { id: number; name: string; email: string };
  created_at: string;
}
