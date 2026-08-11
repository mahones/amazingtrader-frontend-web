import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  themed = false,
}: {
  className?: string;
  /** Switch logo with the light/dark theme instead of always using the white mark. */
  themed?: boolean;
}) {
  if (!themed) {
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

  return (
    <>
      <Image
        src="/logo.png"
        alt="amazingtraders"
        width={680}
        height={422}
        priority
        className={cn("h-20 w-auto dark:hidden", className)}
      />
      <Image
        src="/logo-whitebcc.png"
        alt="amazingtraders"
        width={680}
        height={422}
        priority
        className={cn("hidden h-20 w-auto dark:block", className)}
      />
    </>
  );
}
