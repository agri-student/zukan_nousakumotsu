"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Sprout } from "lucide-react";
import { Crop } from "@/types/crop";
import { SAMPLE_CROPS } from "@/lib/cropData";
import Link from "next/link";

// Build-time data embedded — no API needed
const ALL_CROPS: Crop[] = SAMPLE_CROPS.map((c, i) => ({
  ...c,
  id: `local-${i}`,
}));

function searchLocal(term: string): Crop[] {
  const lower = term.toLowerCase();
  return ALL_CROPS.filter(
    (c) =>
      c.nameJa.includes(term) ||
      c.nameEn.toLowerCase().includes(lower) ||
      c.scientificName.toLowerCase().includes(lower)
  ).slice(0, 8);
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Crop[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const found = searchLocal(value.trim());
    setResults(found);
    setOpen(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const highlight = (text: string) => {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-xl border border-[--border] bg-[--cream] px-3 py-2 focus-within:border-[--sage] focus-within:ring-2 focus-within:ring-[--sage]/20 transition-all">
          <Search size={16} className="shrink-0 text-[--sage]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="和名・英名で検索..."
            className="flex-1 bg-transparent text-sm text-[--soil] placeholder:text-gray-400 outline-none min-w-0"
            aria-label="農作物を検索"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="shrink-0 text-gray-400 hover:text-[--soil] transition-colors"
              aria-label="検索をクリア"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 card-paper overflow-hidden max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-sm text-[--earth]">
              <Sprout size={24} className="mb-2 text-[--sage] opacity-50" />
              <p>「{query}」は見つかりませんでした</p>
            </div>
          ) : (
            <ul className="divide-y divide-[--border]">
              {results.map((crop) => (
                <li key={crop.id}>
                  <Link
                    href={`/crops/${crop.id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[--sage-pale] transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[--sage-pale]">
                      <Sprout size={16} className="text-[--sage]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[--soil]">
                        {highlight(crop.nameJa)}
                      </p>
                      <p className="text-xs text-[--earth]">
                        {highlight(crop.nameEn)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
