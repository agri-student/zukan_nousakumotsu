/**
 * Firestore crops repository.
 * Falls back to local SAMPLE_CROPS when Firebase is not configured
 * (e.g. during development without .env.local or at build time).
 */
import { Crop, Category, Season } from "@/types/crop";
import { SAMPLE_CROPS } from "./cropData";

const COLLECTION = "crops";

function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
}

function mapLocalData(): Crop[] {
  return SAMPLE_CROPS.map((c, i) => ({ ...c, id: `local-${i}` }));
}

export async function getCrops(filters?: {
  season?: Season;
  category?: Category;
}): Promise<Crop[]> {
  if (!isFirebaseConfigured()) {
    let data = mapLocalData();
    if (filters?.season) {
      data = data.filter((c) => c.seasons.includes(filters.season!));
    }
    if (filters?.category) {
      data = data.filter((c) => c.category === filters.category);
    }
    return data;
  }

  // Dynamic import to avoid Firebase initialisation at build time
  const { collection, getDocs, query, orderBy, where } = await import(
    "firebase/firestore"
  );
  const { getDb } = await import("./firebase");
  const db = getDb();

  const constraints = [orderBy("nameJa")];
  if (filters?.category) {
    constraints.unshift(where("category", "==", filters.category) as never);
  }

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  let crops = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Crop));

  if (filters?.season) {
    crops = crops.filter((c) => c.seasons.includes(filters.season!));
  }
  return crops;
}

export async function getCropById(id: string): Promise<Crop | null> {
  if (!isFirebaseConfigured()) {
    if (id.startsWith("local-")) {
      const idx = parseInt(id.replace("local-", ""), 10);
      const crop = SAMPLE_CROPS[idx];
      return crop ? { ...crop, id } : null;
    }
    return null;
  }

  const { doc, getDoc } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Crop;
}

export async function searchCrops(term: string): Promise<Crop[]> {
  const lower = term.toLowerCase();

  if (!isFirebaseConfigured()) {
    return mapLocalData().filter(
      (c) =>
        c.nameJa.includes(term) ||
        c.nameEn.toLowerCase().includes(lower) ||
        c.scientificName.toLowerCase().includes(lower)
    );
  }

  // Simple client-side search over the full collection
  const { collection, getDocs } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  const snap = await getDocs(collection(db, COLLECTION));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Crop));
  return all.filter(
    (c) =>
      c.nameJa.includes(term) ||
      c.nameEn.toLowerCase().includes(lower) ||
      c.scientificName.toLowerCase().includes(lower)
  );
}
