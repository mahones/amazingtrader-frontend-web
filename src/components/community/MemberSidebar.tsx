"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCommunityMembers } from "@/lib/api/community";
import type { CommunityMember } from "@/types/community";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function MemberSidebar() {
  const [members, setMembers] = useState<CommunityMember[] | null>(null);

  useEffect(() => {
    fetchCommunityMembers()
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  return (
    <Card className="lg:sticky lg:top-6 lg:self-start">
      <CardHeader>
        <CardTitle>Membres {members ? `(${members.length})` : ""}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[70vh] space-y-1 overflow-y-auto">
        {members === null && <p className="text-sm text-muted-foreground">Chargement...</p>}
        {members?.length === 0 && <p className="text-sm text-muted-foreground">Aucun membre pour le moment.</p>}
        {members?.map((member) => (
          <div key={member.id} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted">
            <Avatar size="sm">
              <AvatarImage src={member.avatar_url ?? undefined} alt="" />
              <AvatarFallback>{initials(member.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">{member.name}</span>
            {member.is_staff && (
              <Badge variant="outline" className="shrink-0">
                Staff
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
