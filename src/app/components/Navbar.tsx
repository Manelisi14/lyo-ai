"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20">
            <span className="text-base font-semibold">LY</span>
          </span>
          <span>LYO-AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <Link href="#features" className="hover:text-white transition">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition">How It Works</Link>
          <Link href="#about" className="hover:text-white transition">About</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition px-4 py-2">
            Log In
          </Link>
          <Link href="/signup" className="bg-blue-400 text-[#0a0f1e] text-sm font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-sm text-slate-400">
          <Link href="#features" onClick={() => setOpen(false)} className="hover:text-white transition">Features</Link>
          <Link href="#how-it-works" onClick={() => setOpen(false)} className="hover:text-white transition">How It Works</Link>
          <Link href="#about" onClick={() => setOpen(false)} className="hover:text-white transition">About</Link>
          <Link href="/login" className="hover:text-white transition">Log In</Link>
          <Link href="/signup" className="bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg text-center hover:bg-blue-300 transition">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}