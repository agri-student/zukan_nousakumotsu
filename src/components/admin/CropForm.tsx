"use client";

import { useState } from "react";
import {
  Crop, Category, Season, Difficulty, CalendarMonth,
  PestInfo, VarietyInfo, FertilizerInfo,
  CATEGORY_LABELS, SEASON_LABELS,
} from "@/types/crop";
import { Plus, Trash2, Save, X } from "lucide-react";

type CropInput = Omit<Crop, "id" | "createdAt" | "updatedAt">;

const EMPTY_CALENDAR: CalendarMonth[] = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1, sowing: false, planting: false, harvesting: false,
}));

const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const SEASONS = Object.keys(SEASON_LABELS) as Season[];

const EMPTY_PEST: PestInfo = { name: "", type: "disease", symptoms: "", treatment: "" };
const EMPTY_VARIETY: VarietyInfo = { name: "", characteristics: "" };
const EMPTY_FERTILIZER: FertilizerInfo = { baseFertilizer: "", topDressing: "", npkNote: "" };

function toInput(crop?: Crop): CropInput {
  if (!crop) return {
    nameJa: "", nameEn: "", scientificName: "", family: "",
    category: "fruit-vegetable", seasons: [], difficulty: 2,
    description: "", tips: [""], soilType: "", waterFrequency: "",
    sunlight: "", harvestPeriodDays: 60, calendar: EMPTY_CALENDAR,
    varieties: [{ ...EMPTY_VARIETY }],
    pests: [{ ...EMPTY_PEST }],
    fertilizer: { ...EMPTY_FERTILIZER },
    harvestIndicator: "",
    imageUrl: "", thumbnailUrl: "",
  };
  return {
    nameJa: crop.nameJa, nameEn: crop.nameEn,
    scientificName: crop.scientificName, family: crop.family,
    category: crop.category, seasons: crop.seasons,
    difficulty: crop.difficulty, description: crop.description,
    tips: crop.tips.length > 0 ? crop.tips : [""],
    soilType: crop.soilType, waterFrequency: crop.waterFrequency,
    sunlight: crop.sunlight, harvestPeriodDays: crop.harvestPeriodDays,
    calendar: crop.calendar.length === 12 ? crop.calendar : EMPTY_CALENDAR,
    varieties: crop.varieties?.length ? crop.varieties : [{ ...EMPTY_VARIETY }],
    pests: crop.pests?.length ? crop.pests : [{ ...EMPTY_PEST }],
    fertilizer: crop.fertilizer ?? { ...EMPTY_FERTILIZER },
    harvestIndicator: crop.harvestIndicator ?? "",
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

  // ---- tips ----
  const updateTip = (i: number, v: string) => { const t = [...form.tips]; t[i] = v; set("tips", t); };
  const addTip = () => set("tips", [...form.tips, ""]);
  const removeTip = (i: number) => set("tips", form.tips.filter((_, idx) => idx !== i));

  // ---- varieties ----
  const updateVariety = (i: number, field: keyof VarietyInfo, v: string) => {
    const arr = form.varieties.map((x, idx) => idx === i ? { ...x, [field]: v } : x);
    set("varieties", arr);
  };
  const addVariety = () => set("varieties", [...form.varieties, { ...EMPTY_VARIETY }]);
  const removeVariety = (i: number) => set("varieties", form.varieties.filter((_, idx) => idx !== i));

  // ---- pests ----
  const updatePest = (i: number, field: keyof PestInfo, v: string) => {
    const arr = form.pests.map((x, idx) => idx === i ? { ...x, [field]: v } : x);
    set("pests", arr);
  };
  const addPest = () => set("pests", [...form.pests, { ...EMPTY_PEST }]);
  const removePest = (i: number) => set("pests", form.pests.filter((_, idx) => idx !== i));

  // ---- fertilizer ----
  const updateFertilizer = (field: keyof FertilizerInfo, v: string) =>
    set("fertilizer", { ...form.fertilizer!, [field]: v });

  // ---- calendar ----
  const updateCalendar = (month: number, field: "sowing"|"planting"|"harvesting", v: boolean) =>
    set("calendar", form.calendar.map((m) => m.month === month ? { ...m, [field]: v } : m));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameJa.trim()) { setError("和名は必須です。"); return; }
    if (form.seasons.length === 0) { setError("季節を1つ以上選択してください。"); return; }
    setSaving(true); setError("");
    try {
      await onSave({
        ...form,
        tips: form.tips.filter((t) => t.trim()),
        varieties: form.varieties.filter((v) => v.name.trim()),
        pests: form.pests.filter((p) => p.name.trim()),
      });
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* 基本情報 */}
      <Section title="基本情報">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="和名 *"><input {...inp} value={form.nameJa} onChange={(e) => set("nameJa", e.target.value)} placeholder="例：トマト" /></Field>
          <Field label="英名"><input {...inp} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="例：Tomato" /></Field>
          <Field label="学名"><input {...inp} value={form.scientificName} onChange={(e) => set("scientificName", e.target.value)} placeholder="例：Solanum lycopersicum" /></Field>
          <Field label="科名"><input {...inp} value={form.family} onChange={(e) => set("family", e.target.value)} placeholder="例：ナス科" /></Field>
        </div>
      </Section>

      {/* 分類 */}
      <Section title="分類">
        <div className="space-y-4">
          <Field label="カテゴリ *">
            <select {...inp} value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </Field>
          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">旬の季節 <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => {
                const active = form.seasons.includes(s);
                return (
                  <button key={s} type="button"
                    onClick={() => set("seasons", active ? form.seasons.filter((x) => x !== s) : [...form.seasons, s])}
                    className={`tag transition-all ${active ? `tag-${s} ring-2 ring-offset-1 ring-current` : "bg-[--parchment] text-[--earth]"}`}>
                    {SEASON_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">栽培難易度（商業生産基準）</label>
            <div className="flex items-center gap-2">
              {([1,2,3,4,5] as Difficulty[]).map((n) => (
                <button key={n} type="button" onClick={() => set("difficulty", n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${n <= form.difficulty ? "text-[--harvest] bg-[--harvest-pale]" : "text-gray-300 bg-gray-50"}`}>
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-[--earth]">
                {["","初心者向け","標準的","中級","上級","専門的"][form.difficulty]}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 説明・コツ */}
      <Section title="説明・栽培管理のポイント">
        <div className="space-y-4">
          <Field label="概要（農業高校生向けの実践的な内容）">
            <textarea {...inp} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="作物の特徴、農業的価値、栽培上の要点を記述してください。" />
          </Field>
          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-2">栽培管理のポイント</label>
            <div className="space-y-2">
              {form.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--sage] text-white text-xs font-bold">{i + 1}</span>
                  <input {...inp} value={tip} className={`${inpCls} flex-1`} onChange={(e) => updateTip(i, e.target.value)} placeholder={`ポイント ${i + 1}`} />
                  {form.tips.length > 1 && (
                    <button type="button" onClick={() => removeTip(i)} className="mt-1.5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTip} className="flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium"><Plus size={15} />ポイントを追加</button>
            </div>
          </div>
          <Field label="収穫適期の見分け方">
            <textarea {...inp} rows={2} value={form.harvestIndicator ?? ""} onChange={(e) => set("harvestIndicator", e.target.value)} placeholder="色・大きさ・硬さなど、収穫のタイミングを判断する方法" />
          </Field>
        </div>
      </Section>

      {/* 品種情報 */}
      <Section title="主要品種">
        <div className="space-y-3 mt-2">
          {form.varieties.map((v, i) => (
            <div key={i} className="rounded-lg border border-[--border] p-3 space-y-2 bg-[--sage-pale]/30">
              <div className="flex gap-2">
                <input {...inp} value={v.name} className={`${inpCls} w-40 shrink-0`} onChange={(e) => updateVariety(i, "name", e.target.value)} placeholder="品種名" />
                <input {...inp} value={v.characteristics} className={`${inpCls} flex-1`} onChange={(e) => updateVariety(i, "characteristics", e.target.value)} placeholder="特徴・用途" />
                {form.varieties.length > 1 && (
                  <button type="button" onClick={() => removeVariety(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={15} /></button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariety} className="flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium"><Plus size={15} />品種を追加</button>
        </div>
      </Section>

      {/* 施肥情報 */}
      <Section title="施肥管理">
        <div className="space-y-3 mt-2">
          <Field label="元肥">
            <textarea {...inp} rows={2} value={form.fertilizer?.baseFertilizer ?? ""} onChange={(e) => updateFertilizer("baseFertilizer", e.target.value)} placeholder="例：完熟堆肥3kg/m²、化成肥料（N:P:K=10:10:10）を100g/m²施用" />
          </Field>
          <Field label="追肥">
            <textarea {...inp} rows={2} value={form.fertilizer?.topDressing ?? ""} onChange={(e) => updateFertilizer("topDressing", e.target.value)} placeholder="例：定植3週間後から2週間おきにN:K主体の化成肥料を30g/m²" />
          </Field>
          <Field label="N・P・K 管理のポイント">
            <textarea {...inp} rows={2} value={form.fertilizer?.npkNote ?? ""} onChange={(e) => updateFertilizer("npkNote", e.target.value)} placeholder="例：窒素過多に注意。果実肥大期はカリウムを増量する。" />
          </Field>
        </div>
      </Section>

      {/* 病害虫情報 */}
      <Section title="病害虫情報">
        <div className="space-y-3 mt-2">
          {form.pests.map((p, i) => (
            <div key={i} className={`rounded-lg border p-3 space-y-2 ${p.type === "disease" ? "bg-purple-50/50 border-purple-200" : "bg-red-50/50 border-red-200"}`}>
              <div className="flex gap-2 items-center">
                <select value={p.type} onChange={(e) => updatePest(i, "type", e.target.value)}
                  className="rounded-lg border border-[--border] bg-white px-2 py-1.5 text-xs font-semibold outline-none shrink-0">
                  <option value="disease">病気</option>
                  <option value="pest">害虫</option>
                </select>
                <input {...inp} value={p.name} className={`${inpCls} w-40 shrink-0`} onChange={(e) => updatePest(i, "name", e.target.value)} placeholder="名称" />
                {form.pests.length > 1 && (
                  <button type="button" onClick={() => removePest(i)} className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                )}
              </div>
              <input {...inp} value={p.symptoms} className={inpCls} onChange={(e) => updatePest(i, "symptoms", e.target.value)} placeholder="症状" />
              <input {...inp} value={p.treatment} className={inpCls} onChange={(e) => updatePest(i, "treatment", e.target.value)} placeholder="防除・対処法" />
            </div>
          ))}
          <button type="button" onClick={addPest} className="flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium"><Plus size={15} />病害虫を追加</button>
        </div>
      </Section>

      {/* 栽培条件 */}
      <Section title="栽培条件">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="土壌タイプ"><input {...inp} value={form.soilType} onChange={(e) => set("soilType", e.target.value)} placeholder="例：水はけの良い弱酸性土壌（pH 6.0–6.5）" /></Field>
          <Field label="水やり頻度"><input {...inp} value={form.waterFrequency} onChange={(e) => set("waterFrequency", e.target.value)} placeholder="例：週2〜3回" /></Field>
          <Field label="日当たり"><input {...inp} value={form.sunlight} onChange={(e) => set("sunlight", e.target.value)} placeholder="例：日当たり良好" /></Field>
          <Field label="栽培日数目安（日）"><input {...inp} type="number" min={1} max={999} value={form.harvestPeriodDays} onChange={(e) => set("harvestPeriodDays", Number(e.target.value))} /></Field>
        </div>
      </Section>

      {/* 画像 */}
      <Section title="画像URL">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="メイン画像URL"><input {...inp} value={form.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." /></Field>
          <Field label="サムネイルURL"><input {...inp} value={form.thumbnailUrl ?? ""} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://..." /></Field>
        </div>
      </Section>

      {/* 栽培カレンダー */}
      <Section title="栽培カレンダー">
        <p className="text-xs text-[--earth] mb-4">各月に当てはまる作業にチェックを入れてください。</p>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[--parchment]">
                <td className="px-3 py-2 font-semibold text-[--earth] w-24">作業</td>
                {MONTH_LABELS.map((m) => <td key={m} className="px-1 py-2 text-center font-semibold text-[--earth] w-10">{m}</td>)}
              </tr>
            </thead>
            <tbody>
              {(["sowing","planting","harvesting"] as const).map((field, ri) => {
                const labels = { sowing: "🌱 種まき", planting: "🌿 植え付け", harvesting: "🌾 収穫" };
                return (
                  <tr key={field} className={ri % 2 === 0 ? "" : "bg-[--parchment]/50"}>
                    <td className="px-3 py-2 font-medium text-[--soil]">{labels[field]}</td>
                    {form.calendar.map((m) => (
                      <td key={m.month} className="px-1 py-2 text-center">
                        <input type="checkbox" checked={!!m[field]} className="h-4 w-4 rounded cursor-pointer"
                          onChange={(e) => updateCalendar(m.month, field, e.target.checked)} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-[--border]">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[--border] text-sm font-medium text-[--soil] hover:bg-[--parchment] transition-colors">
          <X size={15} />キャンセル
        </button>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[--sage] text-white text-sm font-semibold hover:bg-[--sage-dark] disabled:opacity-60 transition-colors">
          {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
          保存する
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-base font-bold text-[--soil] pb-2 border-b-2 border-[--sage-pale]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[--soil] mb-1">{label}</label>
      {children}
    </div>
  );
}

const inpCls = "w-full rounded-lg border border-[--border] bg-[--cream] px-3 py-2 text-sm text-[--soil] outline-none focus:border-[--sage] focus:ring-2 focus:ring-[--sage]/20 transition-all resize-none";
const inp = { className: inpCls };
