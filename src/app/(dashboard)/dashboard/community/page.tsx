"use client";

import { useEffect, useState } from "react";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CommunityUpsell } from "@/components/community/CommunityUpsell";
import { MemberSidebar } from "@/components/community/MemberSidebar";
import { MobileMembersButton } from "@/components/community/MobileMembersButton";
import { useAuth } from "@/context/AuthContext";
import { fetchCommunityMembers } from "@/lib/api/community";
import type { CommunityMember } from "@/types/community";

export default function DashboardCommunityPage() {
  const { user, isStaff } = useAuth();
  const isMember = isStaff || Boolean(user?.is_community_member);
  const [members, setMembers] = useState<CommunityMember[] | null>(null);

  useEffect(() => {
    if (!isMember) return;
    fetchCommunityMembers()
      .then(setMembers)
      .catch(() => setMembers([]));
  }, [isMember]);

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
          <MemberSidebar members={members} />
          <div className="space-y-4">
            <MobileMembersButton members={members} />
            <CommunityFeed />
          </div>
        </div>
      )}
    </div>
  );
}
