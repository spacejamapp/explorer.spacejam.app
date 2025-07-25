import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import MobileNav from './nav/mobile';
import WebNav from './nav/web';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center justify-between w-full">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center font-bold text-xl space-x-3 group"
          >
            <div className="relative">
              <Image
                src="/spacejam.png"
                alt="spacejam"
                width="40"
                height="40"
                className="rounded-full ring-2 ring-pink-300/20 group-hover:ring-pink-300/40 transition-all duration-300"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-300/20 via-purple-500/20 to-cyan-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="bg-gradient-to-r from-pink-300 via-purple-500 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 ease-out">
              Jamscan
            </div>
          </Link>

          {/* Right - Navigation & Controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WebNav />
            </div>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
