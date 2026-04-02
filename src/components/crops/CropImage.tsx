"use client";

import Image from "next/image";
import { useState } from "react";
import { Sprout } from "lucide-react";
import { Category } from "@/types/crop";

const PLACEHOLDER_COLORS: Record<Category, string> = {
  "fruit-vegetable": "from-red-100 to-orange-100",
  "leaf-vegetable": "from-green-100 to-emerald-100",
  "root-vegetable": "from-amber-100 to-yellow-100",
  grain: "from-yellow-100 to-lime-100",
  fruit: "from-pink-100 to-red-100",
  herb: "from-teal-100 to-green-100",
};

export default function CropImage({
  src,
  alt,
  category,
  className = "",
}: {
  src?: string;
  alt: string;
  category: Category;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const gradientClass = PLACEHOLDER_COLORS[category];

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradientClass} ${className}`}
      >
        <Sprout className="text-[--sage] opacity-40" size={48} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}
