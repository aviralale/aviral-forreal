import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ className, priority }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Aviral, for real"
        width={1390}
        height={519}
        priority={priority}
        className="site-logo-image block h-full w-auto select-none transition-[filter,opacity] duration-300 ease-out"
      />
    </Link>
  );
}