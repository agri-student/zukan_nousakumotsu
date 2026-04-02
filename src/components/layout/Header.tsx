"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, BookOpen, Heart, Menu, X } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[--border] bg-[--card-bg]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[--sage] text-white shadow-sm group-hover:bg-[--sage-dark] transition-colors">
              <Sprout size={20} />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[--sage] leading-none">
                Digital
              </p>
              <p className="text-lg font-bold text-[--soil] leading-tight tracking-tight">
                Agri-Pedia
              </p>
            </div>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={<BookOpen size={16} />}>
              図鑑
            </NavLink>
            <NavLink href="/favorites" icon={<Heart size={16} />}>
              マイ図鑑
            </NavLink>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[--soil] hover:bg-[--sage-pale] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="メニューを開く"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile expanded */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <SearchBar />
            <nav className="flex gap-2">
              <NavLink href="/" icon={<BookOpen size={16} />} onClick={() => setMobileOpen(false)}>
                図鑑
              </NavLink>
              <NavLink href="/favorites" icon={<Heart size={16} />} onClick={() => setMobileOpen(false)}>
                マイ図鑑
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[--soil] hover:bg-[--sage-pale] hover:text-[--sage-dark] transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
