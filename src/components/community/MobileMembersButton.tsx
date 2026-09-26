"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MemberList } from "./MemberSidebar";
import type { CommunityMember } from "@/types/community";

export function MobileMembersButton({ members }: { members: CommunityMember[] | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setOpen(true)}>
        <Users className="size-4" />
        Membres {members ? `(${members.length})` : ""}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader>
            <SheetTitle>Membres {members ? `(${members.length})` : ""}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-1 overflow-y-auto p-4 pt-0">
            <MemberList members={members} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
