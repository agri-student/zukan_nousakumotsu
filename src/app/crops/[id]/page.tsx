import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Droplets,
  Sun,
  Layers,
  Clock,
  Lightbulb,
} from "lucide-react";
import { SAMPLE_CROPS } from "@/lib/cropData";
import { Crop, CATEGORY_LABELS } from "@/types/crop";
import CropImage from "@/components/crops/CropImage";
import SeasonTag from "@/components/crops/SeasonTag";
import DifficultyBadge from "@/components/crops/DifficultyBadge";
import CultivationCalendar from "@/components/crops/CultivationCalendar";
import FavoriteButton from "@/components/crops/FavoriteButton";

// All crops embedded at build time
const ALL_CROPS: Crop[] = SAMPLE_CROPS.map((c, i) => ({
  ...c,
  id: `local-${i}`,
}));

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const crop = ALL_CROPS.find((c) => c.id === id);
  if (!crop) return {};
  return {
    title: `${crop.nameJa}（${crop.nameEn}）`,
    description: crop.description,
  };
}

export function generateStaticParams() {
  return ALL_CROPS.map((c) => ({ id: c.id }));
}

export default async function CropDetailPage({ params }: Props) {
  const { id } = await params;
  const crop = ALL_CROPS.find((c) => c.id === id);
  if (!crop) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] transition-colors font-medium"
      >
        <ArrowLeft size={16} />
        図鑑一覧に戻る
      </Link>

      {/* Header card */}
      <div className="card-paper overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-72 shrink-0" style={{ minHeight: 240 }}>
            <CropImage
              src={crop.imageUrl || crop.thumbnailUrl}
              alt={crop.nameJa}
              category={crop.category}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="tag bg-[--sage] text-white text-xs">
                    {CATEGORY_LABELS[crop.category]}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[--soil]">
                  {crop.nameJa}
                </h1>
                <p className="text-[--earth] font-semibold">{crop.nameEn}</p>
                <p className="text-sm text-gray-400 italic mt-0.5">
                  {crop.scientificName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  科名：{crop.family}
                </p>
              </div>
              <FavoriteButton cropId={crop.id} size="lg" />
            </div>

            {/* Seasons */}
            <div className="flex flex-wrap gap-2">
              {crop.seasons.map((s) => (
                <SeasonTag key={s} season={s} />
              ))}
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[--earth]">
                栽培難易度
              </span>
              <DifficultyBadge difficulty={crop.difficulty} showLabel />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <QuickStat
                icon={<Clock size={14} />}
                label="栽培日数目安"
                value={`約${crop.harvestPeriodDays}日`}
              />
              <QuickStat
                icon={<Sun size={14} />}
                label="日当たり"
                value={crop.sunlight}
              />
              <QuickStat
                icon={<Droplets size={14} />}
                label="水やり"
                value={crop.waterFrequency}
              />
              <QuickStat
                icon={<Layers size={14} />}
                label="土壌タイプ"
                value={crop.soilType}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="card-paper p-6">
        <h2 className="section-title">概要</h2>
        <p className="mt-3 text-[--soil] leading-relaxed">{crop.description}</p>
      </section>

      {/* Cultivation Calendar */}
      <section className="card-paper p-6">
        <h2 className="section-title">栽培カレンダー</h2>
        <p className="mt-1 mb-4 text-xs text-[--earth]">
          種まき・植え付け・収穫の目安時期をひと目で確認できます。
        </p>
        <CultivationCalendar calendar={crop.calendar} />
      </section>

      {/* Tips */}
      <section className="card-paper p-6">
        <h2 className="section-title">
          <Lightbulb size={18} className="text-[--harvest]" />
          育て方のコツ
        </h2>
        <ul className="mt-4 space-y-3">
          {crop.tips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--sage] text-white text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-[--soil] leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Growing conditions */}
      <section className="card-paper p-6">
        <h2 className="section-title">栽培条件</h2>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ConditionItem label="土壌タイプ" value={crop.soilType} />
          <ConditionItem label="水やり頻度" value={crop.waterFrequency} />
          <ConditionItem label="日当たり" value={crop.sunlight} />
          <ConditionItem
            label="栽培日数目安"
            value={`約${crop.harvestPeriodDays}日`}
          />
        </dl>
      </section>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[--sage-pale] px-3 py-2">
      <div className="flex items-center gap-1 text-[--sage] mb-1">
        {icon}
        <span className="text-xs font-semibold text-[--earth]">{label}</span>
      </div>
      <p className="text-xs text-[--soil] font-medium leading-snug">{value}</p>
    </div>
  );
}

function ConditionItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[--border] px-4 py-3">
      <dt className="text-xs font-semibold text-[--earth] mb-1">{label}</dt>
      <dd className="text-sm text-[--soil]">{value}</dd>
    </div>
  );
}
