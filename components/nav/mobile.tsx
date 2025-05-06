"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState } from "react";
import { externalLinks, navSections } from "./index";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <List className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 py-4">
          {externalLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              target="_blank"
              className="px-4 py-2 text-foreground text-sm"
              onClick={handleLinkClick}
            >
              {link.title}
            </Link>
          ))}

          <Accordion type="single" collapsible className="w-full">
            {navSections.map((section) => (
              <AccordionItem
                key={section.title}
                value={section.title.toLowerCase()}
              >
                <AccordionTrigger className="px-4">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="flex flex-col gap-2 pl-4">
                    {section.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="py-2"
                        onClick={handleLinkClick}
                        target={item.target}
                      >
                        <div className="font-medium">{item.title}</div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Annotated sections preserved as comments */}
          {/* 
            The following sections are annotated/inactive:
            {navSections
              .filter(section => section.annotated)
              .map((section) => (
                <AccordionItem key={section.title} value={section.title.toLowerCase()}>
                  <AccordionTrigger className="px-4">{section.title}</AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="flex flex-col gap-2 pl-4">
                      {section.items.map((item) => (
                        <Link key={item.title} href={item.href} className="py-2" onClick={handleLinkClick}>
                          <div className="font-medium">{item.title}</div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
