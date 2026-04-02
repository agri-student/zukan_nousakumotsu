import { CalendarMonth } from "@/types/crop";

const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

interface Props {
  calendar: CalendarMonth[];
}

export default function CultivationCalendar({ calendar }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        {/* Month labels */}
        <div className="grid grid-cols-12 gap-1 mb-1">
          {MONTH_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-semibold text-[--earth] py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-12 gap-1 mb-2">
          {calendar.map((entry, i) => (
            <div key={i} className="calendar-month flex flex-col gap-0.5 p-0.5">
              {entry.sowing && (
                <div
                  className="sowing-bar flex-1 rounded-sm min-h-[6px]"
                  title="種まき"
                />
              )}
              {entry.planting && (
                <div
                  className="planting-bar flex-1 rounded-sm min-h-[6px]"
                  title="植え付け"
                />
              )}
              {entry.harvesting && (
                <div
                  className="harvest-bar flex-1 rounded-sm min-h-[6px]"
                  title="収穫"
                />
              )}
            </div>
          ))}
        </div>

        {/* Legend keys */}
        <div className="flex items-center gap-4 mt-3">
          <LegendItem color="bg-green-300" label="種まき" />
          <LegendItem color="bg-[--sage]" label="植え付け" />
          <LegendItem color="bg-[--harvest]" label="収穫" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-3 w-6 rounded-sm ${color}`} />
      <span className="text-xs text-[--earth]">{label}</span>
    </div>
  );
}
