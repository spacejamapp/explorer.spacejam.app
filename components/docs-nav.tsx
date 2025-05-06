"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type NavGroup } from "@/lib/docs";

interface DocsNavProps {
  navigation: NavGroup[];
}

export function DocsNav({ navigation }: DocsNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed top-14 z-30 -ml-8 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
      <nav className="relative px-4 pb-4 pt-6 lg:px-6">
        {navigation.map((group, groupIndex) => (
          <div key={groupIndex} className="pb-8">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
              {group.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {group.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center rounded-md px-2 py-1.5 hover:underline",
                    pathname === item.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
