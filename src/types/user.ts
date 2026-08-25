import type { Enrollment } from "./course";
import type { UserLicense } from "./license";
import type { UserBotLicense } from "./bot";

export type UserRole = "user" | "admin" | "developer";

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp_number: string | null;
  role: UserRole;
  is_active: boolean;
  has_pending_credentials_change: boolean;
  has_unactivated_license: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  enrollments: Enrollment[];
  user_licenses: UserLicense[];
  user_bot_licenses: UserBotLicense[];
}
