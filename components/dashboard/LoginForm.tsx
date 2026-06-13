"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/admin";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-2xl italic text-text">
          Aviral, for real
        </h1>
        <p className="mt-1 font-mono text-xs text-muted">Dashboard sign in</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-muted">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 font-body text-sm text-text outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-muted">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 font-body text-sm text-text outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 font-body text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-text px-4 py-2.5 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
