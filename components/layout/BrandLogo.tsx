import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <Image
      src={compact ? "/brand/devwordle-mark.svg" : "/brand/devwordle-logo.svg"}
      alt="DevWordle"
      width={compact ? 40 : 274}
      height={compact ? 40 : 40}
      priority
      className={cn("h-8 w-auto select-none", compact && "h-8", className)}
    />
  );
}
