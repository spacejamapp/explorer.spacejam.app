"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActiveCoresProps {
  title?: string;
  className?: string;
}

export default function ActiveCores({
  title = "Active Cores",
  className,
}: ActiveCoresProps) {
  // Total number of cores to display
  const totalCores = 341;

  // State to track which cores are currently highlighted
  const [highlightedCores, setHighlightedCores] = useState<number[]>([]);

  // Function to randomly select cores to highlight
  const getRandomCores = () => {
    // Select a random number of cores to highlight (between 1 and 6)
    const count = Math.floor(Math.random() * 6) + 1;
    const newHighlightedCores: number[] = [];

    // Select that many unique random cores
    while (newHighlightedCores.length < count) {
      const randomIndex = Math.floor(Math.random() * totalCores);
      if (!newHighlightedCores.includes(randomIndex)) {
        newHighlightedCores.push(randomIndex);
      }
    }

    return newHighlightedCores;
  };

  // Set up interval to continually highlight cores
  useEffect(() => {
    // Initialize with some highlighted cores immediately
    setHighlightedCores(getRandomCores());

    // Set up interval to continuously update highlighted cores
    const interval = setInterval(() => {
      setHighlightedCores(getRandomCores());
    }, 6000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Calculate grid dimensions for reasonable layout
  // Adjust columns based on screen size
  const cols = 50;
  const rows = Math.ceil(totalCores / cols);

  // Create array of core elements
  const cores = Array.from({ length: totalCores }).map((_, index) => {
    const isHighlighted = highlightedCores.includes(index);

    return (
      <Link href={`/core/${index}`} title={`Core #${index + 1}`} key={index}>
        <div
          className={cn(
            "w-2 h-2 md:w-3 md:h-3 rounded-sm",
            "text-gray-500 bg-current",
            isHighlighted && "text-pink-500 transition-colors duration-1000"
          )}
        />
      </Link>
    );
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex flex-row items-center justify-between">
          <div>{title}</div>
          <div className="text-xs text-gray-500">
            total of {totalCores} active cores
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-[8px]"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(8px, 1fr))`,
            maxWidth: "100%",
          }}
        >
          {cores}
        </div>
      </CardContent>
    </Card>
  );
}
