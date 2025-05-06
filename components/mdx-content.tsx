"use client";

import { useEffect, useRef } from "react";
import "highlight.js/styles/github-dark.css";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

interface MdxContentProps {
  children: React.ReactNode;
}

export function MdxContent({ children }: MdxContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (contentRef.current) {
      // Update mermaid theme based on current theme
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === "dark" ? "dark" : "default",
        securityLevel: "loose",
      });

      // Find and render mermaid diagrams
      const mermaidDivs =
        contentRef.current.getElementsByClassName("language-mermaid");
      Array.from(mermaidDivs).forEach(async (element) => {
        try {
          const content = element.textContent || "";
          const { svg } = await mermaid.render(
            `mermaid-${Math.random().toString(36).substring(2)}`,
            content
          );
          element.innerHTML = svg;
        } catch (error) {
          console.error("Failed to render mermaid diagram:", error);
        }
      });
    }
  }, [theme, children]);

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <div ref={contentRef} className="mdx">
        {children}
      </div>
    </article>
  );
}
