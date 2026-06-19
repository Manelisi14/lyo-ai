"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";
import { extractTextFromFile } from "@/lib/fileParser";

export default function CVFixerPage() {
  const [cvSource, setCvSource] = useState<"profile" | "new" | null>(null);
  const [cvText, setCvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [profileCV, setProfileCV] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (p) {
      setProfile(p);
      // Build CV text from profile
      const builtCV = buildCVFromProfile(p);
      setProfileCV(builtCV);
    }
    setLoadingProfile(false);
  };

  const buildCVFromProfile = (p: Record<string, string>) => {
    return `
NAME: ${p.full_name || ""}
EMAIL: ${p.email || ""}
PHONE: ${p.phone || ""}
LOCATION: ${p.location || ""}
ID NUMBER: ${p.id_number || ""}

PROFESSIONAL SUMMARY:
${p.summary || ""}

SKILLS:
${p.current_skills || ""}

LANGUAGES: ${p.languages || ""}
DRIVER'S LICENSE: ${p.drivers_license || ""}
OWN TRANSPORT: ${p.own_transport ? "Yes" : "No"}
NATIONALITY: ${p.nationality || "South African"}
    `.trim();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  setFile(selected);
  setExtracting(true);
  setError("");

  try {
    const text = await extractTextFromFile(selected);
    setCvText(text);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to read file");
  } finally {
    setExtracting(false);
  }
};

  const handleFix = async () => {
    const textToUse = cvSource === "profile" ? profileCV : cvText;
    if (!textToUse) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/fix-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: textToUse,
          profile: cvSource === "profile" ? profile : null,
          jobType,
          jobTitle,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();
      setResult(data.fixedCV);

    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: result, profile }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${profile.full_name || "CV"}_LYO-AI.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. Please try copying the text instead.");
    } finally {
      setDownloading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-blue-400 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <div className="border-b border-white/10 px-6 py-5">
        <h1 className="text-2xl font-black mb-1">CV Auto-Fixer</h1>
        <p className="text-slate-400 text-sm">
          AI rewrites your full CV including your name and details — personalized for the job you want.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {!result ? (
          <div className="flex flex-col gap-5">

            {/* Step 1 — Choose CV Source */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-1">Step 1 — Which CV do you want to rewrite?</h2>
              <p className="text-slate-500 text-xs mb-4">Use your saved profile details or upload a new CV</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setCvSource("profile")}
                  className={`p-4 rounded-xl border text-left transition ${
                    cvSource === "profile"
                      ? "border-blue-400 bg-blue-400/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="mb-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-blue-300">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                  </div>
                  <p className="font-semibold text-sm mb-1">Use My Profile CV</p>
                  <p className="text-xs text-slate-500">
                    Use the details saved in your LYO-AI profile
                  </p>
                  {profile.full_name && (
                    <p className="text-xs text-blue-400 mt-2">
                      {profile.full_name}
                    </p>
                  )}
                </button>

                <button
                  onClick={() => setCvSource("new")}
                  className={`p-4 rounded-xl border text-left transition ${
                    cvSource === "new"
                      ? "border-blue-400 bg-blue-400/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="mb-3">
                    <Icon name="document" className="w-12 h-12 mx-auto text-slate-400" />
                  </div>
                  <p className="font-semibold text-sm mb-1">Upload a New CV</p>
                  <p className="text-xs text-slate-500">
                    Upload or paste a different CV to rewrite
                  </p>
                </button>
              </div>

              {/* Upload area for new CV */}
              {cvSource === "new" && (
                <div className="mt-4">
                  <label className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                      file ? "border-blue-400/50 bg-blue-400/5" : "border-white/10 hover:border-white/20"
                    }`}>
                      {file ? (
                        <div>
                          <div className="mb-3">
                            <Icon name="document" className="w-12 h-12 mx-auto text-slate-400" />
                          </div>
                          <div className="text-sm font-medium text-blue-400">{file.name}</div>
                          <div className="text-xs text-slate-500 mt-1">Click to change</div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3">
                            <Icon name="upload" className="w-12 h-12 mx-auto text-slate-400" />
                          </div>
                          <div className="text-sm font-medium mb-1">Upload CV (.txt)</div>
                        </div>
                      )}
                    </div>
                    <input type="file" accept=".txt,.pdf,.docx" onChange={handleFileChange} className="hidden" />
                  </label>

                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Or paste CV text:</p>
                    <textarea
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Paste your CV content here..."
                      rows={6}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 — Job Target */}
            {cvSource && (
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 animate-fade-in">
                <h2 className="font-bold mb-1">Step 2 — What job are you targeting?</h2>
                <p className="text-slate-500 text-xs mb-4">
                  This helps the AI personalize your CV for the right role
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Job Title (optional)</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Software Developer, Accountant"
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Opportunity Type</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition"
                    >
                      <option value="">Any / General</option>
                      <option value="Permanent Job">Permanent Job</option>
                      <option value="Internship">Internship</option>
                      <option value="Learnership">Learnership</option>
                      <option value="Graduate Programme">Graduate Programme</option>
                      <option value="Bursary">Bursary</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Fix Button */}
            {cvSource && (
              <button
                onClick={handleFix}
                disabled={loading || (cvSource === "new" && !cvText)}
                className="w-full bg-blue-400 text-[#0a0f1e] font-bold py-4 rounded-xl text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
              >
                {loading ? "Rewriting your CV..." : "Rewrite My CV →"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Success Banner */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-green-400"><Icon name="check" className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-sm text-green-400">CV Successfully Rewritten!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personalized{jobTitle ? ` for ${jobTitle}` : ""}{jobType ? ` · ${jobType}` : ""}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleCopy}
                className="text-sm bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="text-sm bg-green-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-green-300 transition disabled:opacity-50"
              >
                {downloading ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                onClick={() => { setResult(""); setCvSource(null); setCvText(""); setFile(null); }}
                className="text-sm border border-white/10 text-slate-400 px-5 py-2 rounded-lg hover:bg-white/5 transition"
              >
                Rewrite Again
              </button>
            </div>

            {/* CV Result */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-4">Your Rewritten CV</h2>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                {result}
              </pre>
            </div>

            {/* Cover Letter Prompt */}
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-2xl p-5 text-center">
              <p className="font-bold text-sm mb-1">Want a cover letter too?</p>
              <p className="text-slate-400 text-xs mb-3">
                Generate a personalized cover letter for{jobTitle ? ` ${jobTitle}` : " your target role"}
              </p>
              <Link
                href={`/dashboard/cover-letter?jobTitle=${encodeURIComponent(jobTitle)}&jobType=${encodeURIComponent(jobType)}`}
                className="inline-block bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-300 transition"
              >
                Generate Cover Letter →
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}