"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { updateProfile, calculateEmployabilityScore, getProfile } from "@/lib/profile";
import { Icon } from "@/app/components/Icons";
import { extractTextFromFile } from "@/lib/fileParser";

interface ATSResult {
  score: number;
  summary: string;
  strengths: Array<string | Record<string, unknown>>;
  issues: Array<string | { section?: string; severity?: string; message?: string; fix?: string }>;
  recommendations: Array<string | Record<string, unknown>>;
  keywords_missing: Array<string | Record<string, unknown>>;
}

interface SavedResult {
  id: string;
  file_name: string;
  score: number;
  summary: string;
  created_at: string;
  strengths: Array<string | Record<string, unknown>>;
  issues: Array<string | { section?: string; severity?: string; message?: string; fix?: string }>;
  recommendations: Array<string | Record<string, unknown>>;
  keywords_missing: Array<string | Record<string, unknown>>;
}

export default function CVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState("");
  const [cvText, setCvText] = useState("");
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<"upload" | "history">("upload");
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("cv_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSavedResults(data);
    setLoadingHistory(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  setFile(selected);
  setResult(null);
  setError("");
  setExtracting(true);

  try {
    const text = await extractTextFromFile(selected);
    if (!text || text.length < 20) {
      setError("Could not read enough text from this file. Try a different file.");
      setCvText("");
    } else {
      setCvText(text);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to read file");
    setCvText("");
  } finally {
    setExtracting(false);
  }
};

  const handleAnalyze = async () => {
    if (!file || !cvText) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const parsed: ATSResult = await response.json();
      setResult(parsed);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("cv_results").insert({
          user_id: user.id,
          file_name: file.name,
          cv_text: cvText,
          score: parsed.score,
          summary: parsed.summary,
          strengths: parsed.strengths,
          issues: parsed.issues,
          recommendations: parsed.recommendations,
          keywords_missing: parsed.keywords_missing,
        });

        // Update profile employability score
        const profile = await getProfile();
        if (profile) {
          const empScore = calculateEmployabilityScore(profile, parsed.score);
          await updateProfile({
            cv_score: parsed.score,
            employability_score: empScore,
          });
        }

        // Reload history
        loadHistory();
      }

    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("cv_results").delete().eq("id", id);
    loadHistory();
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-400";
    if (score >= 40) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Great CV!";
    if (score >= 40) return "Needs Work";
    return "Needs Major Fixes";
  };

  const normalizeResultText = (value: string | Record<string, unknown> | null | undefined) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      if ("message" in value && typeof value.message === "string") {
        return value.message;
      }
      if ("section" in value || "severity" in value || "fix" in value) {
        const issue = value as { section?: string; severity?: string; message?: string; fix?: string };
        return [
          issue.section && `Section: ${issue.section}`,
          issue.severity && `Severity: ${issue.severity}`,
          issue.message,
          issue.fix && `Fix: ${issue.fix}`,
        ]
          .filter(Boolean)
          .join(" — ");
      }
      return JSON.stringify(value);
    }
    return String(value ?? "");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black">
          LYO<span className="text-blue-400">-AI</span>
        </span>
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">ATS CV Diagnostic</h1>
          <p className="text-slate-400 text-sm">
            Upload your CV and get an ATS score. All results are saved to your account.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "upload", label: "Upload CV" },
            { key: "history", label: `History (${savedResults.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "upload" | "history")}
              className={`text-sm px-5 py-2 rounded-lg border transition ${
                activeTab === tab.key
                  ? "bg-blue-400 text-[#0a0f1e] font-bold border-blue-400"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-xl p-10 text-center transition ${
                  file ? "border-blue-400/50 bg-blue-400/5" : "border-white/10 hover:border-white/20"
                }`}>
                  {file ? (
                    <div>
                      <div className="mb-3">
                        <Icon name="document" className="w-14 h-14 mx-auto text-slate-400" />
                      </div>
                      <div className="text-sm font-medium text-blue-400">{file.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB · Click to change
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3">
                        <Icon name="upload" className="w-14 h-14 mx-auto text-slate-400" />
                      </div>
                      <div className="text-sm font-medium mb-1">Drop your CV here or click to upload</div>
                      <div className="text-xs text-slate-500">Supports .txt, .pdf and .docx files</div>
                    </div>
                  )}
                </div>
                <input
                 type="file"
                 accept=".txt,.pdf,.docx"
                 onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
              <button
              onClick={handleAnalyze}
              disabled={loading || extracting || !cvText}
              className="w-full mt-4 bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50"
              >
              {extracting ? "Reading file..." : loading ? "Analyzing your CV..." : "Analyze My CV →"}
              </button>
              )}

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="flex flex-col gap-4">

                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-green-400"><Icon name="check" className="w-5 h-5" /></span>
                  <div>
                    <p className="font-semibold text-sm text-green-400">Analysis saved to your account!</p>
                    <p className="text-xs text-slate-400 mt-0.5">View it anytime in the History tab</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-lg">ATS Score</h2>
                      <p className="text-xs text-slate-400 mt-1">{getScoreLabel(result.score)}</p>
                    </div>
                    <div className={`text-5xl font-black ${getScoreColor(result.score)}`}>
                      {result.score}
                      <span className="text-lg text-slate-500">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#0a0f1e] rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${getScoreBg(result.score)}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed">{normalizeResultText(result.summary)}</p>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-green-400"><Icon name="check" className="w-5 h-5" /></span> Strengths
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span> {normalizeResultText(s)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-red-400"><Icon name="xMark" className="w-5 h-5" /></span> Issues Found
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="text-sm text-slate-300 flex flex-col gap-2 rounded-xl border border-red-500/10 bg-red-500/5 p-3">
                        <div className="flex items-center gap-2 text-red-300 text-xs uppercase tracking-[0.18em] font-semibold">
                          <span>Issue {i + 1}</span>
                          {typeof issue === "object" && issue !== null && issue.severity ? <span>{issue.severity}</span> : null}
                        </div>
                        <div>{normalizeResultText(issue)}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-yellow-400"><Icon name="key" className="w-5 h-5" /></span> Missing Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords_missing.map((kw, i) => (
                      <span key={i} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full">
                        {normalizeResultText(kw)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-blue-400"><Icon name="lightbulb" className="w-5 h-5" /></span> Recommendations
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span> {normalizeResultText(rec)}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            {loadingHistory ? (
              <div className="text-center py-16 text-blue-400 animate-pulse text-sm">
                Loading history...
              </div>
            ) : savedResults.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-sm">No CV analyses yet. Upload your first CV!</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 text-xs bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
                >
                  Upload CV →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedResults.map((r) => (
                  <div key={r.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-medium text-sm">{r.file_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(r.created_at).toLocaleDateString("en-ZA", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${getScoreColor(r.score)}`}>
                          {r.score}
                          <span className="text-xs text-slate-500">/100</span>
                        </span>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{r.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

function setExtracting(arg0: boolean) {
  throw new Error("Function not implemented.");
}
