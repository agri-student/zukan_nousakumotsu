"use client";

import { useState, useEffect } from "react";
import { Crop, Category, Season } from "@/types/crop";
import { SAMPLE_CROPS } from "@/lib/cropData";

const LOCAL_CROPS: Crop[] = SAMPLE_CROPS.map((c, i) => ({
  ...c,
  id: `local-${i}`,
}));

function isFirebaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
}

interface Filters {
  season?: Season | null;
  category?: Category | null;
  search?: string;
}

export function useCrops(filters: Filters = {}) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      let data: Crop[] = LOCAL_CROPS;

      if (isFirebaseConfigured()) {
        try {
          const { collection, getDocs, query, orderBy, where } = await import(
            "firebase/firestore"
          );
          const { getDb } = await import("@/lib/firebase");
          const db = getDb();

          const constraints = [orderBy("nameJa")];
          if (filters.category) {
            constraints.unshift(
              where("category", "==", filters.category) as never
            );
          }

          const q = query(collection(db, "crops"), ...constraints);
          const snap = await getDocs(q);
          if (!snap.empty) {
            data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Crop));
          }
        } catch (err) {
          console.warn("Firestore fetch failed, using local data:", err);
        }
      }

      // Apply client-side filters
      if (filters.season) {
        data = data.filter((c) => c.seasons.includes(filters.season!));
      }
      const term = filters.search?.trim().toLowerCase() ?? "";
      if (term) {
        data = data.filter(
          (c) =>
            c.nameJa.includes(filters.search!.trim()) ||
            c.nameEn.toLowerCase().includes(term) ||
            c.scientificName.toLowerCase().includes(term)
        );
      }

      if (!cancelled) {
        setCrops(data);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.season, filters.category, filters.search]);

  return { crops, loading };
}

export function useCrop(id: string) {
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);

      // Try local data first as immediate value
      let found: Crop | null = null;
      if (id.startsWith("local-")) {
        const idx = parseInt(id.replace("local-", ""), 10);
        const c = SAMPLE_CROPS[idx];
        if (c) found = { ...c, id };
      }

      if (isFirebaseConfigured() && !id.startsWith("local-")) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/lib/firebase");
          const db = getDb();
          const snap = await getDoc(doc(db, "crops", id));
          if (snap.exists()) {
            found = { id: snap.id, ...snap.data() } as Crop;
          }
        } catch (err) {
          console.warn("Firestore fetch failed for crop:", id, err);
        }
      }

      if (!cancelled) {
        setCrop(found);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { crop, loading };
}
