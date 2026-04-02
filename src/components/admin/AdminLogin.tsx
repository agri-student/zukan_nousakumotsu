"use client";

import { useState } from "react";
import { Sprout, LogIn, AlertCircle } from "lucide-react";
import { signIn } from "@/hooks/useAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--cream] px-4">
      <div className="card-paper w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[--sage] text-white mb-3">
            <Sprout size={28} />
          </div>
          <h1 className="text-xl font-bold text-[--soil]">管理者ログイン</h1>
          <p className="text-sm text-[--earth] mt-1">Digital Agri-Pedia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[--border] bg-[--cream] px-3 py-2 text-sm text-[--soil] outline-none focus:border-[--sage] focus:ring-2 focus:ring-[--sage]/20 transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[--soil] mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[--border] bg-[--cream] px-3 py-2 text-sm text-[--soil] outline-none focus:border-[--sage] focus:ring-2 focus:ring-[--sage]/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[--sage] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[--sage-dark] disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn size={16} />
            )}
            ログイン
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[--earth]">
          Firebase Authentication でアカウントを作成してください。
        </p>
      </div>
    </div>
  );
}
