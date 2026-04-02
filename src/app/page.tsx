import { SAMPLE_CROPS } from "@/lib/cropData";
import { Crop } from "@/types/crop";
import CropListClient from "@/components/crops/CropListClient";
import { BookOpen, Sprout, Leaf } from "lucide-react";

export default function HomePage() {
  // Embed all crop data at build time — no server needed
  const crops: Crop[] = SAMPLE_CROPS.map((c, i) => ({ ...c, id: `local-${i}` }));

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
              育てる喜びを
              <br />
              <span className="text-[--sage]">すべての人へ</span>
            </h1>
            <p className="mt-4 text-[--earth] text-lg leading-relaxed">
              旬の時期・栽培カレンダー・育て方のコツまで。
              農作物ひとつひとつの魅力を丁寧に紹介します。
            </p>

            {/* Stats */}
            <div className="mt-8 flex gap-6">
              <Stat
                icon={<BookOpen size={18} />}
                value={`${crops.length}種`}
                label="収録作物"
              />
              <Stat
                icon={<Sprout size={18} />}
                value="4季節"
                label="フィルター対応"
              />
              <Stat
                icon={<Leaf size={18} />}
                value="6種"
                label="カテゴリ"
              />
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

      {/* Interactive list — client component handles filtering & search */}
      <CropListClient allCrops={crops} />
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
