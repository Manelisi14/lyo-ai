"use client";

import type { ReactNode } from "react";

const iconStyles = "w-6 h-6 inline-block";

const icons = {
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M12 18h4" />
      <path d="M12 14h4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M12 16V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M4 20h16" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2 2 4-4" />
    </svg>
  ),
  xMark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M3 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0" />
      <path d="M11 11h9" />
      <path d="M20 11v3" />
      <path d="M17 14h3" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" />
      <path d="M6.5 7v10" />
      <path d="M20 7v10" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-5 11.9c.8 1 1 1.8 1 3.1a4 4 0 0 0 8 0c0-1.3.2-2.1 1-3.1A7 7 0 0 0 12 2z" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M3 11h18" />
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M12 2 3 7l9 5 9-5-9-5z" />
      <path d="M3 7v6a9 9 0 0 0 18 0V7" />
      <path d="M12 13v9" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.6 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09c.4.1.78.3 1.08.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M3 3v18h18" />
      <path d="M18 17v-7" />
      <path d="M13 17v-4" />
      <path d="M8 17V7" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M7 4V2h10v2" />
      <path d="M5 4h14v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z" />
      <path d="M8 20h8" />
      <path d="M12 14v6" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M5 15a7 7 0 0 1 14-3.9" />
      <path d="M19 9a7 7 0 0 1-14 3.9" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M16 4h-1.5a2 2 0 0 0-3 0H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <path d="M9 4h6" />
      <path d="M9 10h6" />
    </svg>
  ),
  microphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconStyles}>
      <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10a7 7 0 0 1-14 0" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  ),
} as const;

type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <span className={className}>{icons[name]}</span>;
}
