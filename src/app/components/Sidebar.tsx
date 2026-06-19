"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "briefcase", label: "Job Feed", href: "/dashboard/jobs" },
  { icon: "bookmark", label: "Saved Jobs", href: "/dashboard/saved-jobs" },
  { icon: "applications", label: "Applications", href: "/dashboard/applications" },
  { divider: true },
  { icon: "document", label: "ATS Diagnostic", href: "/dashboard/cv-upload" },
  { icon: "edit", label: "CV Auto-Fixer", href: "/dashboard/cv-fixer" },
  { icon: "letter", label: "Cover Letter", href: "/dashboard/cover-letter" },
  { icon: "gap", label: "Gap Analyzer", href: "/dashboard/gap-analyzer" },
  { icon: "roadmap", label: "Career Roadmap", href: "/dashboard/roadmap" },
  { icon: "interview", label: "Interview Coach", href: "/dashboard/interview" },
  { divider: true },
  { icon: "profile", label: "My Profile", href: "/dashboard/profile" },
];

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M12 12v.01" />
          <path d="M2 12h20" />
        </svg>
      );
    case "bookmark":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-5-8 5V5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "applications":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "document":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case "edit":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      );
    case "letter":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      );
    case "gap":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19h16" />
          <path d="M7 15l3-9 3 5 3-3 3 7" />
        </svg>
      );
    case "roadmap":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      );
    case "interview":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <path d="M12 19v4" />
          <path d="M8 23h8" />
        </svg>
      );
    case "profile":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "menu":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
    case "close":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      );
    default:
      return <span className="inline-block h-4 w-4 rounded bg-slate-700" />;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-xl font-black">
          LYO<span className="text-blue-400">-AI</span>
        </span>
        <p className="text-xs text-slate-500 mt-0.5">Career Companion</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.divider) {
            return <div key={i} className="my-3 border-t border-white/10" />;
          }

          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href!);

          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all ${
                isActive
                  ? "bg-blue-400/15 text-blue-400 font-medium"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`flex-none ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                <NavIcon name={item.icon} />
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Prompt */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-3">
          <p className="text-xs text-blue-400 font-medium mb-1">Complete your profile</p>
          <p className="text-xs text-slate-500 mb-2">Get better job matches</p>
          <Link
            href="/dashboard/profile"
            className="text-xs text-blue-400 hover:underline"
          >
            Update now →
          </Link>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0d1117] border-r border-white/10 fixed left-0 top-0 bottom-0 z-20">
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#0d1117]/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-black">
          LYO<span className="text-blue-400">-AI</span>
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white transition p-1"
        >
          <NavIcon name={mobileOpen ? "close" : "menu"} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d1117] border-r border-white/10 z-40">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}