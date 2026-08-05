"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/user";

export function useRequireRole(roles: UserRole[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, roles, router]);

  return { user, isLoading };
}
