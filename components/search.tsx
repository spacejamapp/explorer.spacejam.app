"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, Command as CommandIcon } from "lucide-react";

export default function SearchComponent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchType, setSearchType] = useState<
    "block" | "validator" | "work" | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set up keyboard shortcut (cmd+k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle search submission
  const handleSearch = () => {
    if (!value.trim()) return;

    // If we've identified the search type, navigate directly
    if (searchType) {
      navigateToResult(searchType, value);
      return;
    }

    // Default behavior - try to determine type from hash format
    // For a real implementation, you might want to check hash formats or call an API

    // For demonstration, we'll just use the first part of the hash to determine type
    if (value.startsWith("0x")) {
      // Hex hash is likely a block
      navigateToResult("block", value);
    } else if (!isNaN(Number(value))) {
      // Numeric ID is likely a validator
      navigateToResult("validator", value);
    } else {
      // Otherwise assume it's a work package
      navigateToResult("work", value);
    }
  };

  // Navigate to the correct result page
  const navigateToResult = (
    type: "block" | "validator" | "work",
    hash: string
  ) => {
    switch (type) {
      case "block":
        router.push(`/block/${hash}`);
        break;
      case "validator":
        router.push(`/validator/${hash}`);
        break;
      case "work":
        router.push(`/work/${hash}`);
        break;
    }
    setValue("");
    setOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by Block / Validator / Work Package"
          className="pl-8 pr-10"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <div className="absolute right-0 h-full px-3 py-2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              className="h-5 w-5 p-0"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start" sideOffset={5}>
          <div className="p-4 text-center">
            <CommandIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-50" />
            <h3 className="font-medium">Search functionality</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Currently under development
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
