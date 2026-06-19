"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icons";

interface GapResult {
  currentMatch: number;
  targetRole: string;
  presentSkills: string[];
  missingSkills: string[];
  recommendedCourses: { name: string; provider: string; url: string; free: boolean }[];
  summary: string;
  timeToReady: string;
}

export default function GapAnalyzerPage() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GapResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!currentSkills || !targetRole) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/gap-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, targetRole, experience }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-black mb-2">Career Gap Analyzer</h1>
          <p className="text-slate-400 text-sm">
            Tell us where you are and where you want to be — our AI will show
            you exactly what skills you are missing and how to get them.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">

          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Your Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Developer, Data Analyst, Accountant"
                className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Your Current Skills</label>
              <textarea
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g. HTML, CSS, basic JavaScript, Microsoft Office, communication skills"
                rows={3}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Years of Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition"
              >
                <option value="0-1">0 - 1 years (Entry Level)</option>
                <option value="1-3">1 - 3 years (Junior)</option>
                <option value="3-5">3 - 5 years (Mid Level)</option>
                <option value="5+">5+ years (Senior)</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !currentSkills || !targetRole}
              className="w-full bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing your gaps..." : "Analyze My Career Gap →"}
            </button>

          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-4">

            {/* Match Score */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg">Current Match</h2>
                  <p className="text-slate-400 text-xs mt-1">
                    How ready you are for <span className="text-blue-400">{result.targetRole}</span>
                  </p>
                </div>
                <div className={`text-5xl font-black ${
                  result.currentMatch >= 70 ? "text-green-400" :
                  result.currentMatch >= 40 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {result.currentMatch}
                  <span className="text-lg text-slate-500">%</span>
                </div>
              </div>
              <div className="w-full bg-[#0a0f1e] rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.currentMatch >= 70 ? "bg-green-400" :
                    result.currentMatch >= 40 ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${result.currentMatch}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs px-4 py-2 rounded-full">
                <Icon name="clock" className="w-4 h-4" />
                <span>Estimated time to job-ready: {result.timeToReady}</span>
              </div>
            </div>

            {/* Skills You Have */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-green-400"><Icon name="check" className="w-5 h-5" /></span> Skills You Already Have
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.presentSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-red-400"><Icon name="xMark" className="w-5 h-5" /></span> Skills You Are Missing
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-400/10 text-red-400 border border-red-400/20 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-400"><Icon name="book" className="w-5 h-5" /></span> Recommended Courses
              </h2>
              <div className="flex flex-col gap-3">
                {result.recommendedCourses.map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{course.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.free && (
                        <span className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-300 transition"
                      >
                        Learn →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setResult(null)}
                className="text-sm border border-white/10 text-slate-400 px-5 py-2 rounded-lg hover:bg-white/5 transition"
              >
                Analyze Again
              </button>
              <Link
                href="/dashboard/roadmap"
                className="text-sm bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                Get Career Roadmap →
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}