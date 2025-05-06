"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      <pre className={cn("relative rounded-lg border p-6", className)}>
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={onCopy}
            className="rounded-md border bg-background px-2 py-1 text-sm opacity-0 transition-opacity  group-hover:opacity-100"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <code className="block p-6 overflow-x-auto">{children}</code>
      </pre>
    </div>
  );
}
