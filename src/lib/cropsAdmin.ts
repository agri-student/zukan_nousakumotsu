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
