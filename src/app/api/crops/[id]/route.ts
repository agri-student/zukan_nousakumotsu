import { NextRequest, NextResponse } from "next/server";
import { getCropById } from "@/lib/cropsRepository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const crop = await getCropById(id);
    if (!crop) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(crop);
  } catch (err) {
    console.error("Error fetching crop:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
