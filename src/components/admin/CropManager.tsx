"use client";

import { useState, useEffect, useCallback } from "react";
import { Crop, CATEGORY_LABELS } from "@/types/crop";
import { addCrop, updateCrop, deleteCrop } from "@/lib/cropsAdmin";
import CropForm from "./CropForm";
import DifficultyBadge from "@/components/crops/DifficultyBadge";
import SeasonTag from "@/components/crops/SeasonTag";
import { Plus, Pencil, Trash2, Sprout, AlertTriangle, ChevronLeft, RefreshCw } from "lucide-react";

type View = "list" | "new" | { type: "edit"; crop: Crop };

export default function CropManager() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [deleteTarget, setDeleteTarget] = useState<Crop | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
      const { getDb } = await import("@/lib/firebase");
      const db = getDb();
      const snap = await getDocs(query(collection(db, "crops"), orderBy("nameJa")));
      setCrops(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Crop)));
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCrops(); }, [fetchCrops]);

  async function handleSave(data: Omit<Crop, "id" | "createdAt" | "updatedAt">) {
    if (view === "new") {
      await addCrop(data);
    } else if (typeof view === "object" && view.type === "edit") {
      await updateCrop(view.crop.id, data);
    }
    setView("list");
    fetchCrops();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCrop(deleteTarget.id);
      setCrops((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  }

  // ---- Crop Form view ----
  if (view === "new" || (typeof view === "object" && view.type === "edit")) {
    const isEdit = typeof view === "object" && view.type === "edit";
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => setView("list")}
            className="flex items-center gap-1.5 text-sm text-[--sage] hover:text-[--sage-dark] font-medium transition-colors">
            <ChevronLeft size={16} />
            一覧に戻る
          </button>
          <h2 className="text-xl font-bold text-[--soil]">
            {isEdit ? `「${(view as { type: "edit"; crop: Crop }).crop.nameJa}」を編集` : "新しい農作物を追加"}
          </h2>
        </div>
        <div className="card-paper p-6">
          <CropForm
            initial={isEdit ? (view as { type: "edit"; crop: Crop }).crop : undefined}
            onSave={handleSave}
            onCancel={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[--soil]">登録済み農作物</h2>
          <p className="text-sm text-[--earth] mt-0.5">{crops.length}件</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCrops}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[--border] text-sm font-medium text-[--soil] hover:bg-[--parchment] transition-colors">
            <RefreshCw size={14} />
            更新
          </button>
          <button onClick={() => setView("new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[--sage] text-white text-sm font-semibold hover:bg-[--sage-dark] transition-colors">
            <Plus size={16} />
            新規追加
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[--sage-pale]">
            <Sprout size={28} className="text-[--sage] animate-pulse" />
          </div>
          <p className="text-sm text-[--earth]">読み込み中...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="card-paper flex flex-col items-center justify-center py-20 text-center">
          <Sprout size={48} className="text-[--sage] opacity-30 mb-4" />
          <p className="text-[--soil] font-bold mb-2">まだ農作物が登録されていません</p>
          <p className="text-sm text-[--earth] mb-6">「新規追加」ボタンから最初の農作物を登録しましょう。</p>
          <button onClick={() => setView("new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[--sage] text-white text-sm font-semibold hover:bg-[--sage-dark] transition-colors">
            <Plus size={16} />
            新規追加
          </button>
        </div>
      ) : (
        <div className="card-paper overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[--parchment] border-b border-[--border]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[--earth]">作物名</th>
                <th className="px-4 py-3 text-left font-semibold text-[--earth] hidden sm:table-cell">カテゴリ</th>
                <th className="px-4 py-3 text-left font-semibold text-[--earth] hidden md:table-cell">季節</th>
                <th className="px-4 py-3 text-left font-semibold text-[--earth] hidden lg:table-cell">難易度</th>
                <th className="px-4 py-3 text-right font-semibold text-[--earth]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {crops.map((crop) => (
                <tr key={crop.id} className="hover:bg-[--sage-pale]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[--soil]">{crop.nameJa}</p>
                    <p className="text-xs text-[--earth]">{crop.nameEn}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="tag bg-[--sage] text-white text-xs">
                      {CATEGORY_LABELS[crop.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {crop.seasons.map((s) => <SeasonTag key={s} season={s} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <DifficultyBadge difficulty={crop.difficulty} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setView({ type: "edit", crop })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[--sage] hover:bg-[--sage-pale] transition-colors"
                      >
                        <Pencil size={13} />
                        編集
                      </button>
                      <button
                        onClick={() => setDeleteTarget(crop)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card-paper w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[--soil]">削除の確認</h3>
            </div>
            <p className="text-sm text-[--soil] leading-relaxed mb-6">
              「<span className="font-bold">{deleteTarget.nameJa}</span>」を削除しますか？
              この操作は元に戻せません。
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-[--border] text-sm font-medium text-[--soil] hover:bg-[--parchment] transition-colors disabled:opacity-60">
                キャンセル
              </button>
              <button onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors">
                {deleting
                  ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  : <Trash2 size={14} />
                }
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
