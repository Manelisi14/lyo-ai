"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Send welcome email
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "welcome",
            to: email,
            name: fullName,
          }),
        });
      } catch {
        console.log("Email failed but signup succeeded");
      }

      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-md text-center bg-[#111827] border border-white/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-xl font-black mb-2">Check your email!</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We sent a confirmation link to <span className="text-blue-400">{email}</span>.
              Click the link to activate your account then log in.
            </p>
            <Link href="/login" className="inline-block mt-6 bg-blue-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-lg text-sm hover:bg-blue-300 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">

            <div className="text-center mb-8">
              <h1 className="text-2xl font-black mb-2">
                Join <span className="text-blue-400">LYO-AI</span> for free
              </h1>
              <p className="text-slate-400 text-sm">
                Start your journey from unemployment to employment
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Thabo Nkosi"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

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
                <label className="text-xs text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
                <p className="text-xs text-slate-600 mt-1">Minimum 8 characters</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                By signing up you agree to our{" "}
                <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating account..." : "Create Free Account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Log in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}