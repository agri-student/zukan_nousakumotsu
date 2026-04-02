import Link from "next/link";
import { Sprout, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[--sage-pale]">
        <Sprout size={48} className="text-[--sage]" />
      </div>
      <h1 className="text-6xl font-bold text-[--sage] mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[--soil] mb-3">
        ページが見つかりませんでした
      </h2>
      <p className="text-[--earth] mb-8 max-w-sm">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-[--sage] px-6 py-3 text-sm font-semibold text-white hover:bg-[--sage-dark] transition-colors"
      >
        <BookOpen size={16} />
        図鑑トップへ戻る
      </Link>
    </div>
  );
}
