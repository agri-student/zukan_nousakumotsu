import { Sprout, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[--border] bg-[--parchment]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout size={20} className="text-[--sage]" />
            <span className="font-bold text-[--soil]">Digital Agri-Pedia</span>
            <span className="text-sm text-[--earth]">農作物デジタル図鑑</span>
          </div>
          <p className="text-sm text-[--earth] flex items-center gap-1">
            <Leaf size={14} className="text-[--sage]" />
            育てる喜びを、すべての人へ
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-[--earth-light]">
          © {new Date().getFullYear()} Digital Agri-Pedia. Built with Next.js &
          Firebase.
        </p>
      </div>
    </footer>
  );
}
