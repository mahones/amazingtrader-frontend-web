"use client";

import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CommunityUpsell } from "@/components/community/CommunityUpsell";
import { MemberSidebar } from "@/components/community/MemberSidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardCommunityPage() {
  const { user, isStaff } = useAuth();
  const isMember = isStaff || Boolean(user?.is_community_member);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Communauté VIP</h1>
        <p className="text-muted-foreground">Échangez avec les autres membres de la communauté.</p>
      </div>

      {!isMember ? (
        <CommunityUpsell />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <MemberSidebar />
          <CommunityFeed />
        </div>
      )}
    </div>
  );
}
