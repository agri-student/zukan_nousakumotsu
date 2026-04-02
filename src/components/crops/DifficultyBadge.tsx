import { Difficulty } from "@/types/crop";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "とても簡単",
  2: "簡単",
  3: "普通",
  4: "やや難しい",
  5: "難しい",
};

export default function DifficultyBadge({
  difficulty,
  showLabel = false,
}: {
  difficulty: Difficulty;
  showLabel?: boolean;
}) {
  return (
    <span className="flex items-center gap-1">
      {([1, 2, 3, 4, 5] as Difficulty[]).map((n) => (
        <span
          key={n}
          className={`difficulty-star ${n <= difficulty ? "filled" : "empty"}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      {showLabel && (
        <span className="ml-1 text-sm text-[--earth]">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
      )}
    </span>
  );
}
