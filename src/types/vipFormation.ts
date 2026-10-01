export interface VipFormation {
  id: number;
  title: string;
  description: string;
  price: number;
  highlights: string[];
  note: string | null;
  is_pinned: boolean;
  pinned_label: string | null;
  is_active: boolean;
  position: number;
  has_active_subscribers?: boolean;
}

export interface UserVipFormation {
  id: number;
  product_snapshot: {
    title: string;
    description: string;
    price: number;
    highlights: string[];
    note: string | null;
  } | null;
  created_at: string;
  vip_formation: VipFormation;
}
