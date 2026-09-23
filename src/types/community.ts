import type { UserRole } from "./user";

export interface CommunityAuthor {
  id: number;
  name: string;
  role: UserRole;
  is_staff: boolean;
  avatar_url: string | null;
}

export interface CommunityReactionSummary {
  counts: Record<string, number>;
  my_reaction: string | null;
}

export interface CommunityAttachment {
  id: number;
  original_filename: string;
  size_bytes: number;
  mime_type: string | null;
}

export interface CommunityMessage {
  id: number;
  body: string;
  parent_id: number | null;
  link_url: string | null;
  link_label: string | null;
  image_url: string | null;
  is_pinned: boolean;
  attachments: CommunityAttachment[];
  author: CommunityAuthor;
  created_at: string;
  can_delete: boolean;
  can_pin: boolean;
  reactions: CommunityReactionSummary;
  replies: CommunityMessage[];
}

export interface CommunityMember {
  id: number;
  name: string;
  role: UserRole;
  is_staff: boolean;
  avatar_url: string | null;
  created_at: string;
}

export const QUICK_REACT_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"] as const;
export type QuickReactEmoji = (typeof QUICK_REACT_EMOJIS)[number];
