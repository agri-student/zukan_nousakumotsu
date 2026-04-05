/**
 * Firestore write operations for the admin panel.
 * Only runs client-side when Firebase is configured.
 */
import { Crop } from "@/types/crop";

const COLLECTION = "crops";

type CropInput = Omit<Crop, "id" | "createdAt" | "updatedAt">;

export async function addCrop(data: CropInput): Promise<string> {
  const { collection, addDoc, serverTimestamp } = await import(
    "firebase/firestore"
  );
  const { getDb } = await import("./firebase");
  const db = getDb();

  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCrop(
  id: string,
  data: Partial<CropInput>
): Promise<void> {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCrop(id: string): Promise<void> {
  const { doc, deleteDoc } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  await deleteDoc(doc(db, COLLECTION, id));
}

/** サンプルデータ（ローカル）の作物を非表示にする。IDはFirestoreに保存。 */
export async function hideLocalCrop(localId: string): Promise<void> {
  const { doc, setDoc, arrayUnion } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  await setDoc(
    doc(db, "settings", "app"),
    { hiddenLocalCropIds: arrayUnion(localId) },
    { merge: true }
  );
}

/** Firestoreに保存された非表示サンプル作物IDのリストを取得する。 */
export async function getHiddenLocalCropIds(): Promise<string[]> {
  const { doc, getDoc } = await import("firebase/firestore");
  const { getDb } = await import("./firebase");
  const db = getDb();

  const snap = await getDoc(doc(db, "settings", "app"));
  if (snap.exists()) {
    return (snap.data().hiddenLocalCropIds as string[]) ?? [];
  }
  return [];
}
