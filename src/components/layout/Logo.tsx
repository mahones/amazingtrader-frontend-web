import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      amazing<span className="text-primary">traders</span>
    </span>
  );
}
