"use client";

import { useState } from "react";
import { Crop, Category, Season, Difficulty, CalendarMonth, CATEGORY_LABELS, SEASON_LABELS } from "@/types/crop";
import { Plus, Trash2, Save, X } from "lucide-react";

type CropInput = Omit<Crop, "id" | "createdAt" | "updatedAt">;

const EMPTY_CALENDAR: CalendarMonth[] = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  sowing: false,
  planting: false,
  harvesting: false,
}));

const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const SEASONS = Object.keys(SEASON_LABELS) as Season[];

function toInput(crop?: Crop): CropInput {
  if (!crop) {
    return {
      nameJa: "", nameEn: "", scientificName: "", family: "",
      category: "fruit-vegetable", seasons: [], difficulty: 2,
      description: "", tips: [""], soilType: "", waterFrequency: "",
      sunlight: "", harvestPeriodDays: 60, calendar: EMPTY_CALENDAR,
      imageUrl: "", thumbnailUrl: "",
    };
  }
  return {
    nameJa: crop.nameJa, nameEn: crop.nameEn,
    scientificName: crop.scientificName, family: crop.family,
    category: crop.category, seasons: crop.seasons,
    difficulty: crop.difficulty, description: crop.description,
    tips: crop.tips.length > 0 ? crop.tips : [""],
    soilType: crop.soilType, waterFrequency: crop.waterFrequency,
    sunlight: crop.sunlight, harvestPeriodDays: crop.harvestPeriodDays,
    calendar: crop.calendar.length === 12 ? crop.calendar : EMPTY_CALENDAR,
    imageUrl: crop.imageUrl ?? "", thumbnailUrl: crop.thumbnailUrl ?? "",
  };
}

interface Props {
  initial?: Crop;
  onSave: (data: CropInput) => Promise<void>;
  onCancel: () => void;
}

export default function CropForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<CropInput>(() => toInput(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof CropInput>(key: K, value: CropInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSeason(s: Season) {
    set("seasons", form.seasons.includes(s)
      ? form.seasons.filter((x) => x !== s)
      : [...form.seasons, s]
    );
  }

  function updateTip(i: number, value: string) {
    const tips = [...form.tips];
    tips[i] = value;
    set("tips", tips);
  }
  function addTip() { set("tips", [...form.tips, ""]); }
  function removeTip(i: number) { set("tips", form.tips.filter((_, idx) => idx !== i)); }

  function updateCalendar(month: number, field: "sowing" | "planting" | "harvesting", value: boolean) {
    set("calendar", form.calendar.map((m) =>
      m.month === month ? { ...m, [field]: value } : m
    ));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameJa.trim()) { setError("和名は必須です。"); return; }
    if (form.seasons.length === 0) { setError("季節を1つ以上選択してください。"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, tips: form.tips.filter((t) => t.trim()) });
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 基本情報 */}
      <section>
        <SectionTitle>基本情報</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label="和名 *" required>
            <input {...inputProps} value={form.nameJa}
              onChange={(e) => set("nameJa", e.target.value)} placeholder="例：トマト" />
          </Field>
          <Field label="英名">
            <input {...inputProps} value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)} placeholder="例：Tomato" />
          </Field>
          <Field label="学名">
            <input {...inputProps} value={form.scientificName}
              onChange={(e) => set("scientificName", e.target.value)} placeholder="例：Solanum lycopersicum" />
          </Field>
          <Field label="科名">
            <input {...inputProps} value={form.family}
              onChange={(e) => set("family", e.target.value)} placeholder="例：ナス科" />
          </Field>
        </div>
      </section>

      {/* カテゴリ・季節 */}
      <section>
        <SectionTitle>分類</SectionTitle>
        <div className="mt-4 space-y-4">
          <Field label="カテゴリ *">
            <select {...inputProps} value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </Field>

          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">
              旬の季節 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => {
                const active = form.seasons.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSeason(s)}
                    className={`tag transition-all ${active
                      ? `tag-${s} ring-2 ring-offset-1 ring-current`
                      : "bg-[--parchment] text-[--earth]"}`}>
                    {SEASON_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">
              栽培難易度
            </label>
            <div className="flex gap-2">
              {([1,2,3,4,5] as Difficulty[]).map((n) => (
                <button key={n} type="button" onClick={() => set("difficulty", n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${
                    n <= form.difficulty
                      ? "text-[--harvest] bg-[--harvest-pale]"
                      : "text-gray-300 bg-gray-50"
                  }`}>
                  ★
                </button>
              ))}
              <span className="ml-2 self-center text-sm text-[--earth]">
                {["","とても簡単","簡単","普通","やや難しい","難しい"][form.difficulty]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 説明 */}
      <section>
        <SectionTitle>説明・コツ</SectionTitle>
        <div className="mt-4 space-y-4">
          <Field label="概要">
            <textarea {...inputProps} rows={4} value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="この農作物の特徴や魅力を書いてください。" />
          </Field>

          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">
              育て方のコツ
            </label>
            <div className="space-y-2">
              {form.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--sage] text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <input {...inputProps} value={tip} className={`${inputCls} flex-1`}
                    onChange={(e) => updateTip(i, e.target.value)}
                    placeholder={`コツ ${i + 1}`} />
                  {form.tips.length > 1 && (
                    <button type="button" onClick={() => removeTip(i)}
                      className="mt-1.5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTip}
                className="flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium transition-colors">
                <Plus size={15} />
                コツを追加
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 栽培条件 */}
      <section>
        <SectionTitle>栽培条件</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label="土壌タイプ">
            <input {...inputProps} value={form.soilType}
              onChange={(e) => set("soilType", e.target.value)}
              placeholder="例：水はけの良い弱酸性土壌（pH 6.0–6.5）" />
          </Field>
          <Field label="水やり頻度">
            <input {...inputProps} value={form.waterFrequency}
              onChange={(e) => set("waterFrequency", e.target.value)}
              placeholder="例：週2〜3回" />
          </Field>
          <Field label="日当たり">
            <input {...inputProps} value={form.sunlight}
              onChange={(e) => set("sunlight", e.target.value)}
              placeholder="例：日当たり良好" />
          </Field>
          <Field label="栽培日数目安（日）">
            <input {...inputProps} type="number" min={1} max={999}
              value={form.harvestPeriodDays}
              onChange={(e) => set("harvestPeriodDays", Number(e.target.value))} />
          </Field>
        </div>
      </section>

      {/* 画像URL */}
      <section>
        <SectionTitle>画像</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label="メイン画像URL">
            <input {...inputProps} value={form.imageUrl ?? ""}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://..." />
          </Field>
          <Field label="サムネイルURL">
            <input {...inputProps} value={form.thumbnailUrl ?? ""}
              onChange={(e) => set("thumbnailUrl", e.target.value)}
              placeholder="https://..." />
          </Field>
        </div>
      </section>

      {/* 栽培カレンダー */}
      <section>
        <SectionTitle>栽培カレンダー</SectionTitle>
        <p className="text-xs text-[--earth] mt-1 mb-4">
          各月に当てはまる作業にチェックを入れてください。
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[--parchment]">
                <td className="px-3 py-2 font-semibold text-[--earth] w-24">作業</td>
                {MONTH_LABELS.map((m) => (
                  <td key={m} className="px-1 py-2 text-center font-semibold text-[--earth] w-10">{m}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["sowing","planting","harvesting"] as const).map((field, ri) => {
                const labels = { sowing: "🌱 種まき", planting: "🌿 植え付け", harvesting: "🌾 収穫" };
                const colors = {
                  sowing: "accent-green-500",
                  planting: "accent-[#87a96b]",
                  harvesting: "accent-orange-500",
                };
                return (
                  <tr key={field} className={ri % 2 === 0 ? "" : "bg-[--parchment]/50"}>
                    <td className="px-3 py-2 font-medium text-[--soil]">{labels[field]}</td>
                    {form.calendar.map((m) => (
                      <td key={m.month} className="px-1 py-2 text-center">
                        <input type="checkbox" checked={!!m[field]}
                          className={`h-4 w-4 rounded cursor-pointer ${colors[field]}`}
                          onChange={(e) => updateCalendar(m.month, field, e.target.checked)} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-[--border]">
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[--border] text-sm font-medium text-[--soil] hover:bg-[--parchment] transition-colors">
          <X size={15} />
          キャンセル
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[--sage] text-white text-sm font-semibold hover:bg-[--sage-dark] disabled:opacity-60 transition-colors">
          {saving
            ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : <Save size={15} />
          }
          保存する
        </button>
      </div>
    </form>
  );
}

// ---- helpers ----

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold text-[--soil] pb-2 border-b-2 border-[--sage-pale]">
      {children}
    </h3>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[--soil] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[--border] bg-[--cream] px-3 py-2 text-sm text-[--soil] outline-none focus:border-[--sage] focus:ring-2 focus:ring-[--sage]/20 transition-all resize-none";

const inputProps = { className: inputCls };
