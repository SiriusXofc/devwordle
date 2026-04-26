"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => <nav ref={ref} className={cn("flex items-center", className)} {...props} />,
);
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn("flex items-center gap-5", className)} {...props} />,
);
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("list-none", className)} {...props} />,
);
NavigationMenuItem.displayName = "NavigationMenuItem";

export { NavigationMenu, NavigationMenuItem, NavigationMenuList };
