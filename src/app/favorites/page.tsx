"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, BookOpen, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Crop } from "@/types/crop";
import CropCard from "@/components/crops/CropCard";
import { SAMPLE_CROPS } from "@/lib/cropData";

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();
  const [favoriteCrops, setFavoriteCrops] = useState<Crop[]>([]);

  useEffect(() => {
    if (!hydrated) return;

    async function loadFavorites() {
      const ids = [...favorites];
      if (ids.length === 0) {
        setFavoriteCrops([]);
        return;
      }

      // Try API first, fall back to local data
      try {
        const responses = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/crops/${id}`);
            if (!res.ok) return null;
            return res.json() as Promise<Crop | null>;
          })
        );
        setFavoriteCrops(responses.filter((c): c is Crop => c !== null));
      } catch {
        // Fallback to local data
        const localCrops = ids
          .map((id) => {
            const idx = parseInt(id.replace("local-", ""));
            const crop = SAMPLE_CROPS[idx];
            return crop ? { ...crop, id } : null;
          })
          .filter((c): c is Crop => c !== null);
        setFavoriteCrops(localCrops);
      }
    }

    loadFavorites();
  }, [favorites, hydrated]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] transition-colors font-medium mb-4"
        >
          <ArrowLeft size={16} />
          図鑑一覧に戻る
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Heart size={20} className="text-red-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[--soil]">マイ図鑑</h1>
            <p className="text-sm text-[--earth]">
              お気に入りに登録した農作物
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {!hydrated ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[--sage] border-t-transparent" />
        </div>
      ) : favoriteCrops.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-sm text-[--earth]">
            {favoriteCrops.length}件のお気に入り
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteCrops.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-paper flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <Heart size={40} className="text-red-300" />
      </div>
      <h2 className="text-xl font-bold text-[--soil] mb-2">
        まだお気に入りがありません
      </h2>
      <p className="text-[--earth] text-sm mb-6 leading-relaxed">
        図鑑一覧でハートボタンをタップすると、
        <br />
        気になる農作物をここに保存できます。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-[--sage] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--sage-dark] transition-colors"
      >
        <BookOpen size={16} />
        図鑑を見る
      </Link>
    </div>
  );
}
