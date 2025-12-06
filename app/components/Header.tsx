'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm py-3 rounded-b-lg">
      <div className="site-container flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold">
            Speckit
          </Link>
          <nav className="hidden md:flex gap-2">
            <Link href="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
            <Link href="/hello" className="btn btn-ghost btn-sm">
              Hello
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <input placeholder="Search" className="input input-sm input-bordered rounded-full" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
