"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { externalLinks, navSections } from "./index";

export default function Header() {
  return (
    <NavigationMenu className="space-x-4">
      {externalLinks.map((link) => (
        <NavigationMenuList
          key={link.title}
          className="text-foreground/60 hover:text-foreground"
        >
          <Link href={link.href} target={link.target} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {link.title}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuList>
      ))}

      {navSections.map((section) => {
        return (
          <NavigationMenuList key={section.title}>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn("text-foreground/60")}>
                {section.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="gap-3 p-4 md:w-[200px] lg:w-[300px]">
                  {section.items.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      target={item.target}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        );
      })}
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
