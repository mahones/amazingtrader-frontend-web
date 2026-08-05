import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-black.svg"
      alt="amazingtraders"
      width={680}
      height={422}
      priority
      className={cn("h-13 w-auto dark:invert", className)}
    />
  );
}
