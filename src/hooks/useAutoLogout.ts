"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

/**
 * Auto-logs out the user after IDLE_TIMEOUT_MS of no interaction. Kept in
 * sync with the backend's sliding token timeout (SANCTUM_INACTIVITY_MINUTES,
 * see backend/config/sanctum.php) so the client-side redirect fires around
 * the same time the token would be rejected server-side anyway.
 */
export function useAutoLogout() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    function handleIdle() {
      toast.warning("Vous avez été déconnecté(e) pour cause d'inactivité.", {
        id: "session-expired",
      });
      logout().finally(() => {
        router.replace("/login");
      });
    }

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleIdle, IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user, logout, router]);
}
