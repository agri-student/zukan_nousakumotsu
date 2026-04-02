"use client";

import { Sprout, LogOut, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth, signOut } from "@/hooks/useAuth";
import { isFirebaseConfigured } from "@/lib/firebase";
import AdminLogin from "@/components/admin/AdminLogin";
import CropManager from "@/components/admin/CropManager";

export default function AdminPage() {
  const { user, loading } = useAuth();

  // Firebase 未設定
  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--cream] px-4">
        <div className="card-paper w-full max-w-md p-8 text-center">
          <Sprout size={40} className="text-[--sage] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[--soil] mb-2">
            Firebase が設定されていません
          </h1>
          <p className="text-sm text-[--earth] leading-relaxed mb-4">
            管理機能を使うには <code className="bg-[--parchment] px-1.5 py-0.5 rounded text-xs">.env.local</code> に Firebase の設定を追加してください。
          </p>
          <pre className="text-left text-xs bg-[--soil] text-green-300 rounded-lg p-4 overflow-x-auto mb-6">
{`NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx`}
          </pre>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[--sage] hover:text-[--sage-dark] font-medium">
            <BookOpen size={15} />
            図鑑トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  // 認証状態ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--cream]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[--sage-pale]">
            <Sprout size={28} className="text-[--sage] animate-pulse" />
          </div>
          <p className="text-sm text-[--earth]">確認中...</p>
        </div>
      </div>
    );
  }

  // 未ログイン
  if (!user) {
    return <AdminLogin />;
  }

  // ログイン済み → 管理画面
  return (
    <div className="min-h-screen bg-[--cream]">
      {/* Admin header */}
      <header className="bg-[--soil] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout size={20} className="text-[--sage-light]" />
            <span className="font-bold text-sm">Agri-Pedia 管理画面</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <ExternalLink size={13} />
              サイトを開く
            </Link>
            <span className="text-xs text-white/50 hidden sm:inline">{user.email}</span>
            <button onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors">
              <LogOut size={13} />
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <CropManager />
      </main>
    </div>
  );
}
