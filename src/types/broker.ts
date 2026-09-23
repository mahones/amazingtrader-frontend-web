export interface Broker {
  id: number;
  name: string;
  category: string | null;
  logo_url: string | null;
  affiliate_url: string;
  description: string | null;
  is_active: boolean;
  position: number;
}
