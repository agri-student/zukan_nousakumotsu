import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { Crop, CATEGORY_LABELS } from "@/types/crop";
import SeasonTag from "./SeasonTag";
import DifficultyBadge from "./DifficultyBadge";
import CropImage from "./CropImage";
import FavoriteButton from "./FavoriteButton";

export default function CropCard({ crop }: { crop: Crop }) {
  return (
    <Link
      href={`/crops/${crop.id}`}
      className="card-paper group block overflow-hidden transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ paddingTop: "60%" }}>
        <div className="absolute inset-0">
          <CropImage
            src={crop.thumbnailUrl || crop.imageUrl}
            alt={crop.nameJa}
            category={crop.category}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="tag bg-[--sage] text-white text-xs shadow-sm">
            {CATEGORY_LABELS[crop.category]}
          </span>
        </div>
        {/* Favorite */}
        <div className="absolute top-2 right-2">
          <FavoriteButton cropId={crop.id} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Name */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-[--soil] leading-tight group-hover:text-[--sage-dark] transition-colors">
            {crop.nameJa}
          </h3>
          <p className="text-sm text-[--earth] font-medium">{crop.nameEn}</p>
          <p className="text-xs text-gray-400 italic mt-0.5">
            {crop.scientificName}
          </p>
        </div>

        {/* Seasons */}
        <div className="flex flex-wrap gap-1 mb-3">
          {crop.seasons.map((s) => (
            <SeasonTag key={s} season={s} />
          ))}
        </div>

        {/* Difficulty + harvest */}
        <div className="flex items-center justify-between text-sm">
          <DifficultyBadge difficulty={crop.difficulty} />
          <span className="flex items-center gap-1 text-[--earth] text-xs">
            <Clock size={12} />
            {crop.harvestPeriodDays}日
          </span>
        </div>

        {/* Description excerpt */}
        <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {crop.description}
        </p>

        {/* CTA */}
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[--sage] group-hover:gap-2 transition-all">
          詳しく見る
          <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
}
