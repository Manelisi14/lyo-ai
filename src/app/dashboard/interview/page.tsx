"use client";
import { useState } from "react";
import Link from "next/link";

interface Question {
  question: string;
  type: string;
  tip: string;
  sampleAnswer: string;
}

export default function InterviewPage() {
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [mode, setMode] = useState<"setup" | "practice">("setup");

  const handleGenerate = async () => {
    if (!jobRole) return;
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole, company, experience }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setActiveQuestion(0);
      setShowAnswer(false);
      setUserAnswer("");
      setFeedback("");
      setMode("practice");

    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!userAnswer) return;
    setFeedbackLoading(true);
    setFeedback("");

    try {
      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[activeQuestion].question,
          userAnswer,
          jobRole,
        }),
      });

      const data = await response.json();
      setFeedback(data.feedback);

    } catch {
      setFeedback("Could not get feedback. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleNext = () => {
    setActiveQuestion(activeQuestion + 1);
    setShowAnswer(false);
    setUserAnswer("");
    setFeedback("");
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("technical")) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (t.includes("behavioral")) return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    if (t.includes("situational")) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
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
          <h1 className="text-3xl font-black mb-2">Interview Coach</h1>
          <p className="text-slate-400 text-sm">
            Practice with AI-generated interview questions tailored to your
            role and get instant feedback on your answers.
          </p>
        </div>

        {/* Setup Mode */}
        {mode === "setup" && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Job Role</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Developer, Marketing Manager, Nurse"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Company Name (optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Capitec Bank, Discovery, MTN"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Your Experience Level</label>
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
                disabled={loading || !jobRole}
                className="w-full bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Preparing your interview..." : "Start mock interview →"}
              </button>

            </div>
          </div>
        )}

        {/* Practice Mode */}
        {mode === "practice" && questions.length > 0 && (
          <div className="flex flex-col gap-4">

            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {activeQuestion + 1} of {questions.length}</span>
              <button
                onClick={() => { setMode("setup"); setQuestions([]); }}
                className="text-slate-500 hover:text-white transition"
              >
                Start Over
              </button>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-1.5">
              <div
                className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((activeQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(questions[activeQuestion].type)}`}>
                  {questions[activeQuestion].type}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-3 leading-relaxed">
                {questions[activeQuestion].question}
              </h2>

              <div className="bg-blue-400/5 border border-blue-400/10 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs text-blue-400">
                  Tip: {questions[activeQuestion].tip}
                </p>
              </div>

              {/* User Answer */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-xs text-slate-400">Your Answer</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
                />
              </div>

              {/* Get Feedback Button */}
              {userAnswer && !feedback && (
                <button
                  onClick={handleGetFeedback}
                  disabled={feedbackLoading}
                  className="w-full bg-purple-400 text-[#0a0f1e] font-bold py-2.5 rounded-lg text-sm hover:bg-purple-300 transition disabled:opacity-50 mb-3"
                >
                  {feedbackLoading ? "Analyzing your answer..." : "Get AI Feedback →"}
                </button>
              )}

              {/* AI Feedback */}
              {feedback && (
                <div className="bg-purple-400/5 border border-purple-400/20 rounded-xl px-4 py-4 mb-4">
                  <p className="text-xs text-purple-400 font-bold mb-2">AI Feedback</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{feedback}</p>
                </div>
              )}

              {/* Sample Answer Toggle */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-xs text-slate-500 hover:text-white transition mb-3"
              >
                {showAnswer ? "Hide" : "Show"} sample answer
              </button>

              {showAnswer && (
                <div className="bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-4 mb-4">
                  <p className="text-xs text-green-400 font-bold mb-2">Sample Answer</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {questions[activeQuestion].sampleAnswer}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                {activeQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-blue-400 text-[#0a0f1e] font-bold py-3 rounded-lg text-sm hover:bg-blue-300 transition"
                  >
                    Next Question →
                  </button>
                ) : (
                  <div className="flex-1 bg-green-400/10 border border-green-400/20 rounded-xl p-4 text-center">
                    <p className="text-green-400 font-bold text-sm mb-1">
                      🎉 Interview Complete!
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      Great practice! Keep preparing and you will ace the real thing.
                    </p>
                    <button
                      onClick={() => { setMode("setup"); setQuestions([]); }}
                      className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
                    >
                      Practice Again
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}