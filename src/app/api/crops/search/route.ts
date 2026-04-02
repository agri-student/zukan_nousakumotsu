import { NextRequest, NextResponse } from "next/server";
import { searchCrops } from "@/lib/cropsRepository";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ crops: [] });
  }

  try {
    const crops = await searchCrops(q);
    return NextResponse.json({ crops: crops.slice(0, 8) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ crops: [] }, { status: 500 });
  }
}
