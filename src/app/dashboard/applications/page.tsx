"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";

interface Application {
  id: string;
  job_title: string;
  company: string;
  location: string;
  job_type: string;
  status: string;
  applied_date: string;
  notes: string;
  job_url: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  Applied: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Interview: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Offer: "text-green-400 bg-green-400/10 border-green-400/20",
  Rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  Withdrawn: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const emptyForm = {
    job_title: "",
    company: "",
    location: "",
    job_type: "Job",
    status: "Applied",
    applied_date: new Date().toISOString().split("T")[0],
    notes: "",
    job_url: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setApplications(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.job_title || !form.company) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      await supabase
        .from("applications")
        .update(form)
        .eq("id", editingId);
    } else {
      await supabase
        .from("applications")
        .insert({ ...form, user_id: user.id });
    }

    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    setSaving(false);
    loadApplications();
  };

  const handleEdit = (app: Application) => {
    setForm({
      job_title: app.job_title,
      company: app.company,
      location: app.location || "",
      job_type: app.job_type || "Job",
      status: app.status,
      applied_date: app.applied_date,
      notes: app.notes || "",
      job_url: app.job_url || "",
    });
    setEditingId(app.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("applications").delete().eq("id", id);
    loadApplications();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("applications").update({ status }).eq("id", id);
    loadApplications();
  };

  const filtered = filter === "All"
    ? applications
    : applications.filter((a) => a.status === filter);

  const stats = {
    total: applications.length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    offers: applications.filter((a) => a.status === "Offer").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

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

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">Application Tracker</h1>
            <p className="text-slate-400 text-sm">
              Track every job you apply to and never lose track of opportunities.
            </p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            className="bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-300 transition whitespace-nowrap"
          >
            + Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-center">
            <Icon name="document" className="mx-auto text-blue-400" />
            <div className="text-2xl font-black text-blue-400">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">Total Applied</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-center">
            <Icon name="microphone" className="mx-auto text-blue-400" />
            <div className="text-2xl font-black text-blue-400">{stats.interviews}</div>
            <div className="text-xs text-slate-500 mt-1">Interviews</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-center">
            <Icon name="trophy" className="mx-auto text-blue-400" />
            <div className="text-2xl font-black text-blue-400">{stats.offers}</div>
            <div className="text-xs text-slate-500 mt-1">Offers</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-center">
            <Icon name="xMark" className="mx-auto text-blue-400" />
            <div className="text-2xl font-black text-blue-400">{stats.rejected}</div>
            <div className="text-xs text-slate-500 mt-1">Rejected</div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-[#111827] border border-blue-400/30 rounded-2xl p-6 mb-6">
            <h2 className="font-bold mb-4">
              {editingId ? "Edit Application" : "Add New Application"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Job Title *</label>
                <input
                  type="text"
                  value={form.job_title}
                  onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                  placeholder="e.g. Software Developer"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Company *</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Capitec Bank"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Cape Town"
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Job Type</label>
                <select
                  value={form.job_type}
                  onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition"
                >
                  {["Job", "Internship", "Learnership", "Graduate Programme", "Bursary"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Date Applied</label>
                <input
                  type="date"
                  value={form.applied_date}
                  onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs text-slate-400">Job URL</label>
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs text-slate-400">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any notes about this application..."
                  rows={2}
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
                />
              </div>

            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.job_title || !form.company}
                className="bg-blue-400 text-[#0a0f1e] font-bold px-6 py-2 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Application" : "Save Application"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="border border-white/10 text-slate-400 px-6 py-2 rounded-lg text-sm hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-4 py-2 rounded-full border transition ${
                filter === s
                  ? "bg-blue-400 text-[#0a0f1e] font-bold border-blue-400"
                  : "border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              {s} {s === "All" ? `(${applications.length})` : `(${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-16 text-blue-400 animate-pulse text-sm">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Icon name="folder" className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <p className="text-sm mb-4">
              {filter === "All" ? "No applications yet. Start tracking your job search!" : `No ${filter} applications yet.`}
            </p>
            {filter === "All" && (
              <button
                onClick={() => setShowForm(true)}
                className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                + Add First Application
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="font-bold text-sm">{app.job_title}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {app.company} {app.location && `· ${app.location}`}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium whitespace-nowrap ${STATUS_COLORS[app.status] || STATUS_COLORS.Applied}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-slate-500 border border-white/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <Icon name="clock" className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(app.applied_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-xs text-slate-500 border border-white/10 px-3 py-1 rounded-full">
                    {app.job_type}
                  </span>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{app.notes}</p>
                )}

                {/* Quick Status Update */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Update status:</span>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(app.id, s)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        app.status === s
                          ? STATUS_COLORS[s]
                          : "border-white/10 text-slate-600 hover:border-white/20"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  {app.job_url ? (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 border border-blue-400/20 px-3 py-1 rounded-lg hover:bg-blue-400/10 transition"
                    >
                      View Real Job Posting →
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 px-3 py-1">
                      No link saved (manual entry)
                    </span>
                  )}
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-xs text-slate-400 border border-white/10 px-3 py-1 rounded-lg hover:bg-white/5 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition"
                  >
                    Delete
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