"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";

function CoverLetterContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [workHistory, setWorkHistory] = useState<Record<string, string>[]>([]);
  const [jobTitle, setJobTitle] = useState(searchParams.get("jobTitle") || "");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

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

    if (p) setProfile(p);

    const { data: wh } = await supabase
      .from("work_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (wh) setWorkHistory(wh);
    setLoadingProfile(false);
  };

  const handleGenerate = async () => {
    if (!jobTitle) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          workHistory,
          jobTitle,
          company,
          jobType,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResult(data.coverLetter);

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
        <h1 className="text-2xl font-black mb-1">📝 Cover Letter Generator</h1>
        <p className="text-slate-400 text-sm">
          AI writes a personalized cover letter using your profile and work history.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {!result ? (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">

            {/* Profile Preview */}
            {profile.full_name && (
              <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4 mb-5">
                <p className="text-xs text-blue-400 font-bold mb-1">Using your profile</p>
                <p className="text-sm font-medium">{profile.full_name}</p>
                <p className="text-xs text-slate-400">{profile.current_skills}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">

              <div>
                <label className="text-xs text-slate-400 block mb-1">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Developer"
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Capitec Bank"
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
                  <option value="">General</option>
                  <option value="Permanent Job">Permanent Job</option>
                  <option value="Internship">Internship</option>
                  <option value="Learnership">Learnership</option>
                  <option value="Graduate Programme">Graduate Programme</option>
                  <option value="Bursary">Bursary</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Job Description (optional but recommended)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a more personalized letter..."
                  rows={4}
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !jobTitle}
                className="w-full bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50"
              >
                {loading ? "Writing your cover letter..." : "Generate Cover Letter →"}
              </button>

            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-green-400"><Icon name="check" className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-sm text-green-400">Cover Letter Ready!</p>
                <p className="text-xs text-slate-400">Personalized for {jobTitle}{company ? ` at ${company}` : ""}</p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleCopy}
                className="text-sm bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={() => setResult("")}
                className="text-sm border border-white/10 text-slate-400 px-5 py-2 rounded-lg hover:bg-white/5 transition"
              >
                Generate Another
              </button>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-4">Your Cover Letter</h2>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                {result}
              </pre>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-blue-400 text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <CoverLetterContent />
    </Suspense>
  );
}