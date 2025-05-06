"use client";

import React, { createContext, useContext, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TocContextType {
  headings: Heading[];
  setHeadings: (headings: Heading[]) => void;
}

const TocContext = createContext<TocContextType>({
  headings: [],
  setHeadings: () => {},
});

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  return (
    <TocContext.Provider value={{ headings, setHeadings }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return useContext(TocContext);
}
