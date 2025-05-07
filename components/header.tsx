import Link from "next/link";
import WebNav from "./nav/web";
import MobileNav from "./nav/mobile";
import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center justify-between w-full">
          {/* left */}

          <Link
            href="/"
            className="flex items-center font-bold text-xl space-x-2"
          >
            <Image
              src="/spacejam.png"
              alt="spacejam"
              width="48"
              height="48"
              className="rounded-full"
            />
            <div>Jamscan</div>
          </Link>

          {/* right */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <WebNav />
            </div>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
