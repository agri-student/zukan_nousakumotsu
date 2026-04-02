export type Season = "spring" | "summer" | "autumn" | "winter";
export type Category =
  | "fruit-vegetable"
  | "leaf-vegetable"
  | "root-vegetable"
  | "grain"
  | "fruit"
  | "herb";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface CalendarMonth {
  /** 1-12 */
  month: number;
  sowing?: boolean;
  planting?: boolean;
  harvesting?: boolean;
}

export interface Crop {
  id: string;
  nameJa: string;
  nameEn: string;
  scientificName: string;
  family: string;
  category: Category;
  seasons: Season[];
  difficulty: Difficulty;
  description: string;
  tips: string[];
  soilType: string;
  waterFrequency: string;
  sunlight: string;
  harvestPeriodDays: number;
  calendar: CalendarMonth[];
  imageUrl?: string;
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "fruit-vegetable": "果菜",
  "leaf-vegetable": "葉菜",
  "root-vegetable": "根菜",
  grain: "穀物",
  fruit: "果物",
  herb: "ハーブ",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

export const SEASON_COLORS: Record<Season, string> = {
  spring: "bg-pink-100 text-pink-700",
  summer: "bg-green-100 text-green-700",
  autumn: "bg-orange-100 text-orange-700",
  winter: "bg-blue-100 text-blue-700",
};
