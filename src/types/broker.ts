export interface Broker {
  id: number;
  name: string;
  logo_url: string | null;
  affiliate_url: string;
  description: string | null;
  is_active: boolean;
  position: number;
}
