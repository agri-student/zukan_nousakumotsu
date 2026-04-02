"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Season, Category, SEASON_LABELS, CATEGORY_LABELS } from "@/types/crop";
import { SlidersHorizontal } from "lucide-react";

const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];
const CATEGORIES: Category[] = [
  "fruit-vegetable",
  "leaf-vegetable",
  "root-vegetable",
  "grain",
  "fruit",
  "herb",
];

const SEASON_EMOJI: Record<Season, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSeason = searchParams.get("season") as Season | null;
  const activeCategory = searchParams.get("category") as Category | null;

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const toggleSeason = (s: Season) =>
    setParam("season", activeSeason === s ? null : s);
  const toggleCategory = (c: Category) =>
    setParam("category", activeCategory === c ? null : c);

  const hasFilter = activeSeason || activeCategory;

  return (
    <div className="card-paper p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[--soil]">
          <SlidersHorizontal size={16} className="text-[--sage]" />
          絞り込み
        </h2>
        {hasFilter && (
          <button
            onClick={() => {
              const params = new URLSearchParams();
              router.push(pathname + "?" + params.toString());
            }}
            className="text-xs text-[--earth] underline hover:text-[--harvest] transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* Season filter */}
      <div>
        <p className="text-xs font-semibold text-[--earth] mb-2 uppercase tracking-wider">
          季節
        </p>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSeason(s)}
              className={`tag transition-all hover:scale-105 ${
                activeSeason === s
                  ? `tag-${s} ring-2 ring-offset-1 ring-current`
                  : "bg-[--parchment] text-[--earth] hover:bg-[--earth-pale]"
              }`}
            >
              <span role="img" aria-label={SEASON_LABELS[s]}>
                {SEASON_EMOJI[s]}
              </span>
              {SEASON_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-[--earth] mb-2 uppercase tracking-wider">
          カテゴリ
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`tag transition-all hover:scale-105 ${
                activeCategory === c
                  ? "bg-[--sage] text-white ring-2 ring-offset-1 ring-[--sage]"
                  : "bg-[--parchment] text-[--earth] hover:bg-[--sage-pale] hover:text-[--sage-dark]"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
