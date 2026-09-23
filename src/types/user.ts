import type { Enrollment } from "./course";
import type { UserLicense } from "./license";
import type { UserBotLicense } from "./bot";
import type { Partner } from "./partner";

export type UserRole = "user" | "admin" | "developer";

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp_number: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  has_pending_credentials_change: boolean;
  has_unactivated_license: boolean;
  is_community_member: boolean;
  is_partner?: boolean;
  partner_status?: "pending" | "approved" | "rejected" | null;
  created_at: string;
}

export interface UserProfile extends User {
  community_access_granted: boolean;
  enrollments: Enrollment[];
  user_licenses: UserLicense[];
  user_bot_licenses: UserBotLicense[];
  partner: Partner | null;
}
