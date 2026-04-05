"use client";

import Link from "next/link";
import {
  ArrowLeft, Droplets, Sun, Layers, Clock, Lightbulb,
  Sprout, Bug, Leaf, FlaskConical, Wheat,
} from "lucide-react";
import { useCrop } from "@/hooks/useCrops";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DIFFICULTY_DESC } from "@/types/crop";
import CropImage from "./CropImage";
import SeasonTag from "./SeasonTag";
import DifficultyBadge from "./DifficultyBadge";
import CultivationCalendar from "./CultivationCalendar";
import FavoriteButton from "./FavoriteButton";

export default function CropDetailClient({ id }: { id: string }) {
  const { crop, loading } = useCrop(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[--sage-pale]">
          <Sprout size={32} className="text-[--sage] animate-pulse" />
        </div>
        <p className="text-sm text-[--earth]">データを読み込み中...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[--sage-pale]">
          <Sprout size={32} className="text-[--sage] opacity-40" />
        </div>
        <h2 className="text-xl font-bold text-[--soil]">この農作物は見つかりませんでした</h2>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium">
          <ArrowLeft size={16} /> 図鑑一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] transition-colors font-medium">
        <ArrowLeft size={16} /> 図鑑一覧に戻る
      </Link>

      {/* ヘッダーカード */}
      <div className="card-paper overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-72 shrink-0" style={{ minHeight: 240 }}>
            <CropImage src={crop.imageUrl || crop.thumbnailUrl} alt={crop.nameJa} category={crop.category} className="absolute inset-0 w-full h-full" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="tag bg-[--sage] text-white text-xs mb-2 inline-block">{CATEGORY_LABELS[crop.category]}</span>
                <h1 className="text-3xl font-bold text-[--soil]">{crop.nameJa}</h1>
                <p className="text-[--earth] font-semibold">{crop.nameEn}</p>
                <p className="text-sm text-gray-400 italic mt-0.5">{crop.scientificName}</p>
                <p className="text-xs text-gray-400 mt-0.5">科名：{crop.family}</p>
              </div>
              <FavoriteButton cropId={crop.id} size="lg" />
            </div>
            <div className="flex flex-wrap gap-2">
              {crop.seasons.map((s) => <SeasonTag key={s} season={s} />)}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[--earth]">栽培難易度</span>
              <div>
                <DifficultyBadge difficulty={crop.difficulty} />
                <p className="text-xs text-[--earth] mt-0.5">
                  {DIFFICULTY_LABELS[crop.difficulty]}：{DIFFICULTY_DESC[crop.difficulty]}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <QuickStat icon={<Clock size={14} />} label="栽培日数目安" value={`約${crop.harvestPeriodDays}日`} />
              <QuickStat icon={<Sun size={14} />} label="日当たり" value={crop.sunlight} />
              <QuickStat icon={<Droplets size={14} />} label="水やり" value={crop.waterFrequency} />
              <QuickStat icon={<Layers size={14} />} label="土壌タイプ" value={crop.soilType} />
            </div>
          </div>
        </div>
      </div>

      {/* 概要 */}
      <section className="card-paper p-6">
        <h2 className="section-title">概要</h2>
        <p className="mt-3 text-[--soil] leading-relaxed">{crop.description}</p>
      </section>

      {/* 収穫適期 */}
      {crop.harvestIndicator && (
        <section className="card-paper p-6">
          <h2 className="section-title">
            <Wheat size={18} className="text-[--harvest]" />
            収穫適期の見分け方
          </h2>
          <p className="mt-3 text-[--soil] leading-relaxed">{crop.harvestIndicator}</p>
        </section>
      )}

      {/* 品種情報 */}
      {crop.varieties && crop.varieties.length > 0 && (
        <section className="card-paper p-6">
          <h2 className="section-title">
            <Leaf size={18} className="text-[--sage]" />
            主要品種
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {crop.varieties.map((v, i) => (
              <div key={i} className="rounded-lg border border-[--border] bg-[--sage-pale]/40 px-4 py-3">
                <p className="font-bold text-[--soil] text-sm">{v.name}</p>
                <p className="text-xs text-[--earth] mt-1 leading-relaxed">{v.characteristics}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 施肥情報 */}
      {crop.fertilizer && (
        <section className="card-paper p-6">
          <h2 className="section-title">
            <FlaskConical size={18} className="text-[--earth]" />
            施肥管理
          </h2>
          <div className="mt-4 space-y-3">
            <FertilizerItem label="元肥" value={crop.fertilizer.baseFertilizer} color="bg-amber-50 border-amber-200" />
            <FertilizerItem label="追肥" value={crop.fertilizer.topDressing} color="bg-green-50 border-green-200" />
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="text-xs font-bold text-blue-700 mb-1">N・P・K 管理のポイント</p>
              <p className="text-sm text-[--soil] leading-relaxed">{crop.fertilizer.npkNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* 病害虫情報 */}
      {crop.pests && crop.pests.length > 0 && (
        <section className="card-paper p-6">
          <h2 className="section-title">
            <Bug size={18} className="text-red-500" />
            病害虫情報
          </h2>
          <div className="mt-4 space-y-3">
            {crop.pests.map((p, i) => (
              <div key={i} className={`rounded-lg border px-4 py-3 ${p.type === "disease" ? "bg-purple-50 border-purple-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`tag text-xs ${p.type === "disease" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"}`}>
                    {p.type === "disease" ? "病気" : "害虫"}
                  </span>
                  <p className="font-bold text-[--soil] text-sm">{p.name}</p>
                </div>
                <p className="text-xs text-[--soil] mb-1"><span className="font-semibold">症状：</span>{p.symptoms}</p>
                <p className="text-xs text-[--soil]"><span className="font-semibold">防除・対処：</span>{p.treatment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 栽培カレンダー */}
      <section className="card-paper p-6">
        <h2 className="section-title">栽培カレンダー</h2>
        <p className="mt-1 mb-4 text-xs text-[--earth]">種まき・植え付け・収穫の目安時期をひと目で確認できます。</p>
        <CultivationCalendar calendar={crop.calendar} />
      </section>

      {/* 育て方のコツ */}
      <section className="card-paper p-6">
        <h2 className="section-title">
          <Lightbulb size={18} className="text-[--harvest]" />
          栽培管理のポイント
        </h2>
        <ul className="mt-4 space-y-3">
          {crop.tips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--sage] text-white text-xs font-bold">{i + 1}</span>
              <p className="text-[--soil] leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 栽培条件 */}
      <section className="card-paper p-6">
        <h2 className="section-title">栽培条件</h2>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ConditionItem label="土壌タイプ" value={crop.soilType} />
          <ConditionItem label="水やり頻度" value={crop.waterFrequency} />
          <ConditionItem label="日当たり" value={crop.sunlight} />
          <ConditionItem label="栽培日数目安" value={`約${crop.harvestPeriodDays}日`} />
        </dl>
      </section>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function FertilizerItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${color}`}>
      <p className="text-xs font-bold text-[--earth] mb-1">{label}</p>
      <p className="text-sm text-[--soil] leading-relaxed">{value}</p>
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
