"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRequireRole } from "@/hooks/useRequireRole";
import { fetchAdminUsersPaged } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";

const ROLES = [
  { value: "tout", label: "Tous les rôles" },
  { value: "user", label: "Membre" },
  { value: "admin", label: "Administrateur" },
];

const PURCHASE_FILTERS = [
  { value: "tout", label: "Tous les achats" },
  { value: "course", label: "Formations payées" },
  { value: "license", label: "Licence auto-trading" },
  { value: "bot_license", label: "Bots de trading achetés" },
];

export default function DashboardUsersPage() {
  useRequireRole(["admin", "developer"]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("tout");
  const [purchase, setPurchase] = useState("tout");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[] | null>(null);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number } | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAdminUsersPaged({
        search: search || undefined,
        role: role === "tout" ? undefined : role,
        purchase: purchase === "tout" ? undefined : purchase,
        page,
      }).then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, role, purchase, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">Recherchez et gérez les comptes de la plateforme.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value ?? "tout");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={purchase}
          onValueChange={(value) => {
            setPurchase(value ?? "tout");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Achats" />
          </SelectTrigger>
          <SelectContent>
            {PURCHASE_FILTERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Inscrit le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users === null && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                Chargement...
              </TableCell>
            </TableRow>
          )}
          {users?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                Aucun utilisateur trouvé.
              </TableCell>
            </TableRow>
          )}
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Link href={`/dashboard/users/${u.id}`} className="font-medium text-primary hover:underline">
                  {u.name}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell className="capitalize">{u.role}</TableCell>
              <TableCell>
                <Badge variant={u.is_active ? "default" : "secondary"}>
                  {u.is_active ? "Actif" : "Désactivé"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(u.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} / {meta.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
