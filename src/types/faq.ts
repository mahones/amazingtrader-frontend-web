export interface Faq {
  id: number;
  category: string | null;
  question: string;
  answer: string;
  is_featured: boolean;
  is_active: boolean;
  position: number;
}
