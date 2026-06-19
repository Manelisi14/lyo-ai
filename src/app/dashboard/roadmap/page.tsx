"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icons";

interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  skills: string[];
  tasks: string[];
  milestone: string;
}

interface RoadmapResult {
  targetRole: string;
  totalDuration: string;
  summary: string;
  phases: RoadmapPhase[];
}

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [error, setError] = useState("");
  const [activePhase, setActivePhase] = useState(0);

  const handleGenerate = async () => {
    if (!targetRole) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, currentSkills, experience }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();
      setResult(data);
      setActivePhase(0);

    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const phaseColors = [
    "bg-blue-400/10 border-blue-400/30 text-blue-400",
    "bg-purple-400/10 border-purple-400/30 text-purple-400",
    "bg-teal-400/10 border-teal-400/30 text-teal-400",
    "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
    "bg-green-400/10 border-green-400/30 text-green-400",
    "bg-orange-400/10 border-orange-400/30 text-orange-400",
  ];

  const phaseNumberColors = [
    "bg-blue-400 text-[#0a0f1e]",
    "bg-purple-400 text-[#0a0f1e]",
    "bg-teal-400 text-[#0a0f1e]",
    "bg-yellow-400 text-[#0a0f1e]",
    "bg-green-400 text-[#0a0f1e]",
    "bg-orange-400 text-[#0a0f1e]",
  ];

  return (
    <main className="min-h-screen text-white">

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
          <h1 className="text-3xl font-black mb-2">Career Roadmap</h1>
          <p className="text-slate-400 text-sm">
            Get a personalized step-by-step plan to reach your dream career
            in South Africa.
          </p>
        </div>

        {/* Input Form */}
        {!result && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Your Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Scientist, Chartered Accountant"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Your Current Skills (optional)</label>
                <textarea
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="e.g. HTML, CSS, basic Python, Excel"
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
                onClick={handleGenerate}
                disabled={loading || !targetRole}
                className="w-full bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Building your roadmap..." : "Generate My Roadmap →"}
              </button>

            </div>
          </div>
        )}

        {/* Roadmap Result */}
        {result && (
          <div className="flex flex-col gap-4">

            {/* Summary Card */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-bold text-lg">
                    Roadmap to <span className="text-blue-400">{result.targetRole}</span>
                  </h2>
                  <p className="text-slate-400 text-xs mt-1 inline-flex items-center gap-2">
                    <Icon name="clock" className="w-4 h-4" />
                    Total estimated time: {result.totalDuration}
                  </p>
                </div>
                <span className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full whitespace-nowrap">
                  {result.phases.length} Phases
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>
            </div>

            {/* Phase Tabs */}
            <div className="flex gap-2 flex-wrap">
              {result.phases.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={`text-xs px-4 py-2 rounded-full border transition font-medium ${
                    activePhase === i
                      ? phaseColors[i % phaseColors.length]
                      : "border-white/10 text-slate-500 hover:border-white/20"
                  }`}
                >
                  Phase {phase.phase}
                </button>
              ))}
            </div>

            {/* Active Phase Detail */}
            {result.phases[activePhase] && (
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${phaseNumberColors[activePhase % phaseNumberColors.length]}`}>
                    {result.phases[activePhase].phase}
                  </div>
                  <div>
                    <h2 className="font-bold">{result.phases[activePhase].title}</h2>
                    <p className="text-xs text-slate-400"><Icon name="clock" className="w-4 h-4 inline-block mr-2" />{result.phases[activePhase].duration}</p>
                  </div>
                </div>

                {/* Skills to learn */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Skills to learn:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.phases[activePhase].skills.map((skill, j) => (
                      <span
                        key={j}
                        className={`text-xs px-3 py-1 rounded-full border ${phaseColors[activePhase % phaseColors.length]}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Tasks:</p>
                  <ul className="flex flex-col gap-2">
                    {result.phases[activePhase].tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-0.5">→</span> {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestone */}
                <div className="bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1 inline-flex items-center gap-2">
                    <Icon name="trophy" className="w-4 h-4 text-yellow-300" />
                    Phase Milestone
                  </p>
                  <p className="text-sm text-white">{result.phases[activePhase].milestone}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 mt-4">
                  {activePhase > 0 && (
                    <button
                      onClick={() => setActivePhase(activePhase - 1)}
                      className="text-xs border border-white/10 text-slate-400 px-4 py-2 rounded-lg hover:bg-white/5 transition"
                    >
                      ← Previous Phase
                    </button>
                  )}
                  {activePhase < result.phases.length - 1 && (
                    <button
                      onClick={() => setActivePhase(activePhase + 1)}
                      className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition"
                    >
                      Next Phase →
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setResult(null)}
                className="text-sm border border-white/10 text-slate-400 px-5 py-2 rounded-lg hover:bg-white/5 transition"
              >
                Generate New Roadmap
              </button>
              <Link
                href="/dashboard/interview"
                className="text-sm bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                Practice Interviews →
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}