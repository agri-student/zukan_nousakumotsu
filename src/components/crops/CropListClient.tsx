"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Crop, Category, Season } from "@/types/crop";
import CropGrid from "./CropGrid";
import FilterBar from "./FilterBar";

function CropListInner({ allCrops }: { allCrops: Crop[] }) {
  const searchParams = useSearchParams();
  const season = searchParams.get("season") as Season | null;
  const category = searchParams.get("category") as Category | null;
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

  let filtered = allCrops;

  if (season) {
    filtered = filtered.filter((c) => c.seasons.includes(season));
  }
  if (category) {
    filtered = filtered.filter((c) => c.category === category);
  }
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.nameJa.includes(search) ||
        c.nameEn.toLowerCase().includes(search) ||
        c.scientificName.toLowerCase().includes(search)
    );
  }

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
              <span className="ml-2 text-sm font-normal text-[--earth]">
                {filtered.length}件
              </span>
            </h2>
          </div>
          <CropGrid crops={filtered} />
        </div>
      </div>
    </section>
  );
}

export default function CropListClient({ allCrops }: { allCrops: Crop[] }) {
  return (
    <Suspense>
      <CropListInner allCrops={allCrops} />
    </Suspense>
  );
}
