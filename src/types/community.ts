import type { UserRole } from "./user";

export interface CommunityAuthor {
  id: number;
  name: string;
  role: UserRole;
  is_staff: boolean;
}

export interface CommunityReactionSummary {
  counts: Record<string, number>;
  my_reaction: string | null;
}

export interface CommunityMessage {
  id: number;
  body: string;
  parent_id: number | null;
  author: CommunityAuthor;
  created_at: string;
  can_delete: boolean;
  reactions: CommunityReactionSummary;
  replies: CommunityMessage[];
}

export interface CommunityMember {
  id: number;
  name: string;
  role: UserRole;
  is_staff: boolean;
  created_at: string;
}

export const QUICK_REACT_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"] as const;
export type QuickReactEmoji = (typeof QUICK_REACT_EMOJIS)[number];
