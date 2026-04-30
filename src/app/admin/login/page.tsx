"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "로그인 실패");
      }
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-100 px-6">
      <form onSubmit={onSubmit} className="bg-white p-10 w-full max-w-md shadow-sm">
        <Image src="/logo.png" alt="Truezyme" width={140} height={36} className="h-7 w-auto mx-auto mb-8" />
        <h1 className="font-serif text-2xl text-center mb-8">관리자 로그인</h1>

        <label className="block text-xs uppercase tracking-[.15em] mb-2">이메일</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line px-4 py-3 mb-5 focus:outline-none focus:border-primary"
          autoComplete="username"
        />

        <label className="block text-xs uppercase tracking-[.15em] mb-2">비밀번호</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line px-4 py-3 mb-6 focus:outline-none focus:border-primary"
          autoComplete="current-password"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
