"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DashboardSkeleton } from "../components/Skeleton";
import { Icon } from "../components/Icons";

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

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [employabilityScore, setEmployabilityScore] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filterType, search]);

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const name = user.user_metadata?.full_name || user.email || "User";
    setUserName(name);

    // Load profile
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (p) {
      setEmployabilityScore(p.employability_score || 0);
    }

    const profileComplete = p && (
      p.current_skills || p.target_role || p.preferred_job_type !== "Any"
    );
    setHasProfile(!!profileComplete);

    // Load application stats
    const { data: apps } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", user.id);

    if (apps) {
      setStats({
        applications: apps.length,
        interviews: apps.filter((a) => a.status === "Interview").length,
        offers: apps.filter((a) => a.status === "Offer").length,
      });
    }

    setLoading(false);

    // Load jobs automatically
    await fetchJobs(!!profileComplete, p || {});
  };

  const fetchJobs = async (
    hasProf: boolean,
    prof: Record<string, string>
  ) => {
    setJobsLoading(true);
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
      setJobsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];
    if (filterType !== "All") {
      result = result.filter((j) => j.type === filterType);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (score >= 60) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <main className="min-h-screen bg-transparent text-white">

      {/* Top Bar */}
      <header className="border border-white/10 bg-sa-panel px-6 py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl shadow-xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {hasProfile ? "Your personalized opportunities are ready." : "Complete your profile for better recommendations."}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-900 transition"
        >
          Log out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Applications", value: stats.applications, subtitle: "Tracked" , href: "/dashboard/applications" },
            { label: "Interviews", value: stats.interviews, subtitle: "Scheduled", href: "/dashboard/applications" },
            { label: "Offers", value: stats.offers, subtitle: "Pending", href: "/dashboard/applications" },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-sa-panel border border-white/10 rounded-3xl p-5 text-center hover:-translate-y-1 hover:border-blue-400/40 transition-transform duration-200 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            >
              <div className="text-3xl font-semibold text-slate-100">{s.value}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mt-2">{s.label}</div>
              <div className="text-xs text-slate-400 mt-1">{s.subtitle}</div>
            </Link>
          ))}
        </div>

        {/* Profile Prompt */}
        {!hasProfile && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm uppercase tracking-[0.2em] text-blue-300 mb-2">
                  Profile recommended
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Complete your profile with your skills, qualifications, and preferences to get higher-quality matches.
                </p>
              </div>
              <Link
                href="/dashboard/profile"
                className="text-xs bg-blue-400 text-slate-950 font-semibold px-5 py-2 rounded-full hover:bg-blue-300 transition"
              >
                Complete profile
              </Link>
            </div>
          </div>
        )}

        {/* Job Feed Section */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg text-slate-100">
              {hasProfile ? "Recommended opportunities" : "Available opportunities"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Browse the latest jobs matched to your profile.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                  .from("profiles")
                  .select("full_name, email")
                  .eq("id", user.id)
                  .single();

                await fetch("/api/send-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "job_alert",
                    to: profile?.email || user.email,
                    name: profile?.full_name || "there",
                    jobs: jobs.slice(0, 5).map((j) => ({
                      title: j.title,
                      company: j.company,
                      location: j.location,
                      type: j.type,
                      matchScore: j.matchScore,
                    })),
                  }),
                });
                alert("Job alert sent to your email!");
              }}
              className="text-xs border border-slate-700 text-slate-300 px-3 py-2 rounded-full hover:bg-slate-900 transition"
            >
              Email me jobs
            </button>
            <button
              onClick={() => loadDashboard()}
              className="text-xs text-blue-400 border border-blue-400/20 px-3 py-2 rounded-full hover:bg-blue-400/10 transition"
            >
              Refresh list
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs, companies, industries..."
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition mb-3"
        />

        {/* Type Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {["All", "Job", "Learnership", "Bursary", "Graduate Programme", "Internship"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                filterType === t
                  ? "bg-blue-400 text-[#0a0f1e] font-bold border-blue-400"
                  : "border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              {t}
              {t === "All"
                ? ` (${jobs.length})`
                : ` (${jobs.filter((j) => j.type === t).length})`}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {jobsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-bounce">
              <Icon name="search" className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-blue-400 text-sm animate-pulse">
              {hasProfile
                ? "Finding opportunities matched to your profile..."
                : "Loading all opportunities across South Africa..."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="mb-4">
              <Icon name="search" className="w-10 h-10 text-slate-600 mx-auto" />
            </div>
            <p className="text-sm">No results. Try different filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-base">{job.title}</h3>
                      {job.isNew && (
                        <span className="text-[10px] uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getMatchColor(job.matchScore)}`}>
                    {job.matchScore}% match
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border ${TYPE_COLORS[job.type] || TYPE_COLORS["Job"]}`}>
                    {job.type}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400">
                    {job.industry}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400">
                      <Icon name="briefcase" className="w-4 h-4" />
                      {job.salary}
                    </span>
                  )}
                  {job.closing_date && (
                    <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-white/10 text-slate-400">
                      <Icon name="clock" className="w-4 h-4" />
                      {job.closing_date}
                    </span>
                  )}
                </div>

                {job.seta && (
                  <div className="mb-3">
                    <span className="flex items-center gap-2 text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20 px-3 py-1 rounded-full">
                      <Icon name="graduation" className="w-4 h-4" />
                      {job.seta}
                    </span>
                  </div>
                )}

                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  {job.description}
                </p>

                {expandedJob === job.id && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap mt-3">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-500 text-slate-950 font-semibold px-4 py-2 rounded-full hover:bg-blue-400 transition"
                  >
                    Apply now
                  </a>

                  {/* Auto Apply — shows for 80%+ match */}
                  {job.matchScore >= 80 && (
                    <button
                      onClick={async () => {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user) return;

                        const { data: p } = await supabase
                          .from("profiles")
                          .select("*")
                          .eq("id", user.id)
                          .single();

                        const { data: wh } = await supabase
                          .from("work_history")
                          .select("*")
                          .eq("user_id", user.id);

                        if (!p?.email) {
                          alert("Please complete your profile first.");
                          return;
                        }

                        alert("Generating your tailored CV and cover letter... We will email you shortly!");

                        fetch("/api/auto-apply", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            job,
                            profile: p,
                            workHistory: wh || [],
                          }),
                        }).then(() => {
                          alert(`Done! Check ${p.email} for your tailored CV, cover letter and apply link.`);
                        });
                      }}
                      className="text-xs bg-green-500 text-slate-950 font-semibold px-4 py-2 rounded-full hover:bg-green-400 transition flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      Auto Apply
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="text-xs border border-slate-700 text-slate-300 px-4 py-2 rounded-full hover:bg-slate-900 transition"
                  >
                    {expandedJob === job.id ? "Hide requirements" : "View requirements"}
                  </button>

             <button
              onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;
              await supabase.from("saved_jobs").insert({
              user_id: user.id,
              title: job.title,
              company: job.company,
              location: job.location,
              type: job.type,
              salary: job.salary,
              apply_url: job.applyUrl,
              });
               alert("Job saved successfully.");
               }}
               className="text-xs border border-slate-700 text-slate-300 px-4 py-2 rounded-full hover:bg-slate-900 transition"
                >
                Save job
             </button>

              <button
                  onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;

                  await supabase.from("applications").insert({
                   user_id: user.id,
                   job_title: job.title,
                   company: job.company,
                   location: job.location,
                   job_type: job.type,
                   status: "Applied",
                   applied_date: new Date().toISOString().split("T")[0],
                   job_url: job.applyUrl,
                   notes: `Salary: ${job.salary || "Not specified"} · Match: ${job.matchScore}% · Source: Adzuna`,
                   });

                   alert(`Tracked: ${job.title} at ${job.company}`);
                   }}
                   className="text-xs border border-slate-700 text-slate-300 px-4 py-2 rounded-full hover:bg-slate-900 transition"
                   >
                   Track application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}