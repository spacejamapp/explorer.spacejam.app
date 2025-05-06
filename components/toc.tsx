"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useToc } from "./toc-provider";

export function TableOfContents() {
  const { headings } = useToc();
  const [activeId, setActiveId] = useState<string>("");
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>(
    {}
  );

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      // Update entries in our ref
      entries.forEach((entry) => {
        headingElementsRef.current[entry.target.id] = entry;
      });

      // Get all entries from the ref
      const allEntries = Object.values(headingElementsRef.current);

      // Find all visible headings
      const visibleHeadings = allEntries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      // If we have visible headings, use the first one
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id);
      } else {
        // Find the closest heading above the viewport
        const closestHeading = allEntries
          .filter((entry) => entry.boundingClientRect.top < 0)
          .sort(
            (a, b) => b.boundingClientRect.top - a.boundingClientRect.top
          )[0];

        if (closestHeading) {
          setActiveId(closestHeading.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -80% 0px",
      threshold: [0, 1],
    });

    const headingElements = Array.from(
      document.querySelectorAll(
        "article h1, article h2, article h3, article h4"
      )
    );

    // Initialize our ref with all headings
    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      headingElementsRef.current = {};
    };
  }, [headings]); // Add headings as dependency to reinitialize when content changes

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="font-medium text-sm">On This Page</div>
      <div className="space-y-1">
        {headings.map((heading) => {
          const level = heading.level;
          const indent =
            level === 1
              ? "pl-0"
              : level === 2
              ? "pl-4"
              : level === 3
              ? "pl-6"
              : "pl-8";

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "block text-sm py-1 hover:text-foreground transition-colors",
                indent,
                activeId === heading.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const yOffset = -100;
                  const y =
                    element.getBoundingClientRect().top +
                    window.scrollY +
                    yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </div>
  );
}
