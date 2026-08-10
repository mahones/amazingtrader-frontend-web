import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-whitebcc.png"
      alt="amazingtraders"
      width={680}
      height={422}
      priority
      className={cn("h-20 w-auto", className)}
    />
  );
}
