import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunityUpsell() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Crown className="size-6" />
        </div>
        <CardTitle>Réservé aux membres VIP</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          La Communauté VIP est accessible à toute personne ayant acheté une formation, une licence
          auto-trading ou un bot. Faites votre premier achat pour rejoindre les échanges.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/dashboard/formations">Voir les formations</Link>} />
          <Button variant="outline" render={<Link href="/dashboard/auto-trading">Voir l&apos;auto-trading</Link>} />
        </div>
      </CardContent>
    </Card>
  );
}
