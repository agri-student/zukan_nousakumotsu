"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Category, Season } from "@/types/crop";
import { useCrops } from "@/hooks/useCrops";
import CropGrid from "./CropGrid";
import FilterBar from "./FilterBar";
import { Sprout } from "lucide-react";

function CropListInner() {
  const searchParams = useSearchParams();
  const season = (searchParams.get("season") as Season) || undefined;
  const category = (searchParams.get("category") as Category) || undefined;
  const search = searchParams.get("search") ?? "";

  const { crops, loading } = useCrops({ season, category, search });

  const heading = search
    ? `「${search}」の検索結果`
    : season || category
    ? "絞り込み結果"
    : "すべての農作物";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filter */}
        <aside className="lg:w-60 shrink-0">
          <FilterBar />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[--soil]">
              {heading}
              {!loading && (
                <span className="ml-2 text-sm font-normal text-[--earth]">
                  {crops.length}件
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[--sage-pale]">
                <Sprout size={28} className="text-[--sage] animate-pulse" />
              </div>
              <p className="text-sm text-[--earth]">データを読み込み中...</p>
            </div>
          ) : (
            <CropGrid crops={crops} />
          )}
        </div>
      </div>
    </section>
  );
}

export default function CropListClient() {
  return (
    <Suspense>
      <CropListInner />
    </Suspense>
  );
}
