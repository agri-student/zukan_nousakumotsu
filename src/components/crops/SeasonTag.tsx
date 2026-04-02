import { Season, SEASON_LABELS } from "@/types/crop";

const SEASON_EMOJI: Record<Season, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

export default function SeasonTag({ season }: { season: Season }) {
  return (
    <span className={`tag tag-${season}`}>
      <span role="img" aria-label={SEASON_LABELS[season]}>
        {SEASON_EMOJI[season]}
      </span>
      {SEASON_LABELS[season]}
    </span>
  );
}
