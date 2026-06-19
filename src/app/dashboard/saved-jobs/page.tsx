"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  apply_url: string;
  saved_at: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false });

    if (data) setSavedJobs(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("saved_jobs").delete().eq("id", id);
    loadSavedJobs();
  };

  return (
    <main className="min-h-screen text-white">

      <div className="border-b border-white/10 px-6 py-6 bg-sa-panel backdrop-blur">
        <h1 className="text-2xl font-semibold mb-1">Saved jobs</h1>
        <p className="text-slate-400 text-sm">Your shortlisted roles, saved for later review.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-blue-400 animate-pulse text-sm">Loading...</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-sm mb-4">No saved jobs yet. Save roles from the dashboard to review them later.</p>
            <a href="/dashboard" className="text-xs bg-blue-400 text-[#0a0f1e] font-semibold px-5 py-2 rounded-lg hover:bg-blue-300 transition inline-block">
              Browse available jobs
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedJobs.map((job) => (
              <div key={job.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className="font-bold text-sm">{job.title}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">{job.company} · {job.location}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="text-xs border border-white/10 text-slate-400 px-3 py-1 rounded-full">{job.type}</span>
                  {job.salary && (
                    <span className="text-xs border border-white/10 text-slate-400 px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <Icon name="briefcase" className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}