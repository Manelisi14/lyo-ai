"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  industry: string;
  salary: string;
  description: string;
  requirements: string[];
  closing_date: string;
  matchScore: number;
  applyUrl: string;
  isNew: boolean;
  seta: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  "Job": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Learnership": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Bursary": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Graduate Programme": "text-teal-400 bg-teal-400/10 border-teal-400/20",
  "Internship": "text-green-400 bg-green-400/10 border-green-400/20",
  "Skills Programme": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function JobFeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [search, setSearch] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filterType, filterLocation, search]);

  const loadFeed = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profileComplete = p && (
      p.current_skills || p.target_role || p.preferred_job_type !== "Any"
    );

    setHasProfile(!!profileComplete);
    if (p) setProfile(p);

    await fetchJobs(!!profileComplete, p || {});
    setLoading(false);
  };

  const fetchJobs = async (hasProf: boolean, prof: Record<string, string>) => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/job-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: prof, hasProfile: hasProf }),
      });
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
        setFiltered(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];

    if (filterType !== "All") {
      result = result.filter((j) => j.type === filterType);
    }

    if (filterLocation) {
      result = result.filter((j) =>
        j.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (search) {
      result = result.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.industry.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (score >= 60) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sa-hero flex flex-col items-center justify-center gap-3">
        <div className="mx-auto h-12 w-12 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />      </div>
    );
  }

  return (
    <main className="min-h-screen text-white">

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-5 sticky top-0 bg-sa-panel backdrop-blur z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black mb-1">Job Feed</h1>
            <p className="text-slate-400 text-sm">
              {hasProfile
                ? `Showing opportunities matched to your profile`
                : "Complete your profile for personalized matches"}
            </p>
          </div>
          <button
            onClick={() => fetchJobs(hasProfile, profile)}
            disabled={refreshing}
            className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition disabled:opacity-50 whitespace-nowrap"
          >
            {refreshing ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs, companies, industries..."
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition mb-3"
        />

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Job", "Learnership", "Bursary", "Graduate Programme", "Internship", "Skills Programme"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                filterType === t
                  ? "bg-blue-400 text-[#0a0f1e] font-bold border-blue-400"
                  : "border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              {t} {t === "All" ? `(${jobs.length})` : `(${jobs.filter(j => j.type === t).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">

        {/* Profile Prompt */}
        {!hasProfile && (
          <div className="bg-blue-400/10 border border-blue-400/20 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <div className="text-blue-400"><Icon name="profile" className="w-8 h-8" /></div>
            <div>
              <p className="font-bold text-sm mb-1">Get personalized job matches!</p>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Complete your profile with your skills, qualifications and preferences
                and we'll filter these results specifically for you.
              </p>
              <Link
                href="/dashboard/profile"
                className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition inline-block"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        )}

        {/* Location Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            placeholder="Filter by location (e.g. Johannesburg, Cape Town)"
            className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        {/* Results Count */}
        <p className="text-xs text-slate-500 mb-4">
          Showing <span className="text-white font-medium">{filtered.length}</span> opportunities
          {hasProfile && <span className="text-blue-400"> · Filtered for your profile</span>}
        </p>

        {/* Job Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-sm">No results found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-bold text-sm">{job.title}</h2>
                      {job.isNew && (
                        <span className="text-xs bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs">{job.company} · {job.location}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${getMatchColor(job.matchScore)}`}>
                    {job.matchScore}% match
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border ${TYPE_COLORS[job.type] || TYPE_COLORS["Job"]}`}>
                    {job.type}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400">
                    {job.industry}
                  </span>
                  {job.salary && (
                    <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400 inline-flex items-center gap-1">
                      <Icon name="briefcase" className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                  {job.closing_date && (
                    <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400 inline-flex items-center gap-1">
                      <Icon name="clock" className="w-3.5 h-3.5" />
                      Closes {job.closing_date}
                    </span>
                  )}
                </div>

                {/* SETA Badge */}
                {job.seta && (
                  <div className="mb-3">
                    <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <Icon name="graduation" className="w-3.5 h-3.5" />
                      {job.seta}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  {job.description}
                </p>

                {/* Expanded Details */}
                {expandedJob === job.id && (
                  <div className="mb-4 animate-fade-in">
                    <p className="text-xs text-slate-500 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <span key={i} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition"
                    >
                      Apply Now →
                    </a>
                  )}
                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="text-xs border border-white/10 text-slate-400 px-4 py-2 rounded-lg hover:bg-white/5 transition"
                  >
                    {expandedJob === job.id ? "Show Less" : "View Requirements"}
                  </button>
                  <Link
                    href={`/dashboard/applications?prefill=${encodeURIComponent(JSON.stringify({ job_title: job.title, company: job.company, location: job.location, job_type: job.type }))}`}
                    className="text-xs border border-white/10 text-slate-400 px-4 py-2 rounded-lg hover:bg-white/5 transition"
                  >
                    + Track Application
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}