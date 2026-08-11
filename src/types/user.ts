import type { Enrollment } from "./course";
import type { UserLicense } from "./license";
import type { UserBotLicense } from "./bot";

export type UserRole = "user" | "admin" | "developer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  enrollments: Enrollment[];
  user_licenses: UserLicense[];
  user_bot_licenses: UserBotLicense[];
}
