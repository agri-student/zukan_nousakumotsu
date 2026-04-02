import { Crop } from "@/types/crop";
import CropCard from "./CropCard";
import { Sprout } from "lucide-react";

export default function CropGrid({ crops }: { crops: Crop[] }) {
  if (crops.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[--sage-pale]">
          <Sprout size={40} className="text-[--sage]" />
        </div>
        <h3 className="text-lg font-bold text-[--soil]">
          該当する農作物が見つかりませんでした
        </h3>
        <p className="mt-2 text-sm text-[--earth]">
          フィルターや検索条件を変えてお試しください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </div>
  );
}
