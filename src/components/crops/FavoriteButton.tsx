"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({
  cropId,
  size = "md",
}: {
  cropId: string;
  size?: "sm" | "md" | "lg";
}) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(cropId);

  const sizeMap = {
    sm: { icon: 14, btn: "p-1.5" },
    md: { icon: 18, btn: "p-2" },
    lg: { icon: 22, btn: "p-2.5" },
  };
  const { icon, btn } = sizeMap[size];

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(cropId);
      }}
      className={`${btn} rounded-full transition-all ${
        active
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-white/80 text-gray-400 hover:bg-red-50 hover:text-red-400"
      } shadow-sm backdrop-blur-sm`}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart
        size={icon}
        fill={active ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
