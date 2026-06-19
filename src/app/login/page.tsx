"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">

            <div className="text-center mb-8">
              <h1 className="text-2xl font-black mb-2">
                Welcome back to <span className="text-blue-400">LYO-AI</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Log in to continue your career journey
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400">Password</label>
                  <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign up free
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}