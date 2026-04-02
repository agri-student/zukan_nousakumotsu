import { Suspense } from "react";
import { getCrops } from "@/lib/cropsRepository";
import { Category, Season } from "@/types/crop";
import CropGrid from "@/components/crops/CropGrid";
import FilterBar from "@/components/crops/FilterBar";
import { Sprout, BookOpen, Leaf } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ season?: string; category?: string; search?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const season = params.season as Season | undefined;
  const category = params.category as Category | undefined;
  const searchQuery = params.search?.trim();

  const allCrops = await getCrops({ season, category });

  const crops = searchQuery
    ? allCrops.filter(
        (c) =>
          c.nameJa.includes(searchQuery) ||
          c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.scientificName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : allCrops;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[--sage-pale] via-[--cream] to-[--earth-pale] border-b border-[--border]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[--sage]/10 px-4 py-1.5 text-sm font-medium text-[--sage-dark] mb-4">
              <Leaf size={14} />
              農作物デジタル図鑑
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[--soil] leading-tight tracking-tight">
              育てる喜びを<br />
              <span className="text-[--sage]">すべての人へ</span>
            </h1>
            <p className="mt-4 text-[--earth] text-lg leading-relaxed">
              旬の時期・栽培カレンダー・育て方のコツまで。
              農作物ひとつひとつの魅力を丁寧に紹介します。
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-6">
              <Stat icon={<BookOpen size={18} />} value={`${allCrops.length}種`} label="収録作物" />
              <Stat icon={<Sprout size={18} />} value="4季節" label="フィルター対応" />
              <Stat icon={<Leaf size={18} />} value="6種" label="カテゴリ" />
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[--sage]/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-20 bottom-0 h-48 w-48 rounded-full bg-[--harvest]/5"
        />
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="lg:w-60 shrink-0">
            <Suspense>
              <FilterBar />
            </Suspense>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[--soil]">
                {searchQuery
                  ? `「${searchQuery}」の検索結果`
                  : season || category
                  ? "絞り込み結果"
                  : "すべての農作物"}
                <span className="ml-2 text-sm font-normal text-[--earth]">
                  {crops.length}件
                </span>
              </h2>
            </div>
            <CropGrid crops={crops} />
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[--sage]">{icon}</div>
      <div>
        <p className="text-lg font-bold text-[--soil] leading-none">{value}</p>
        <p className="text-xs text-[--earth] mt-0.5">{label}</p>
      </div>
    </div>
  );
}
