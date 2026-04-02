import { Metadata } from "next";
import { SAMPLE_CROPS } from "@/lib/cropData";
import CropDetailClient from "@/components/crops/CropDetailClient";

// Pre-build static shells for all local sample crops.
// Firestore crops (with real IDs) are handled client-side at runtime.
export function generateStaticParams() {
  return SAMPLE_CROPS.map((_, i) => ({ id: `local-${i}` }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id.startsWith("local-")) {
    const idx = parseInt(id.replace("local-", ""), 10);
    const crop = SAMPLE_CROPS[idx];
    if (crop) {
      return {
        title: `${crop.nameJa}（${crop.nameEn}）`,
        description: crop.description,
      };
    }
  }
  return { title: "農作物詳細" };
}

export default async function CropDetailPage({ params }: Props) {
  const { id } = await params;
  // All rendering is delegated to the client component so it can
  // fetch from Firestore (or fall back to local data) at runtime.
  return <CropDetailClient id={id} />;
}
