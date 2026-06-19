"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Icon } from "@/app/components/Icons";

interface WorkHistory {
  id?: string;
  company: string;
  job_title: string;
  start_date: string;
  end_date: string;
  current_job: boolean;
  responsibilities: string;
}

interface Education {
  id?: string;
  institution: string;
  qualification: string;
  field_of_study: string;
  nqf_level: string;
  start_year: string;
  end_year: string;
  completed: boolean;
}

interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  year: string;
}

type TabType = "personal" | "employment" | "education" | "preferences" | "documents";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [userId, setUserId] = useState("");

  // Personal Info
  const [personal, setPersonal] = useState({
    full_name: "",
    email: "",
    phone: "",
    id_number: "",
    gender: "",
    race: "",
    nationality: "South African",
    disability: "None",
    drivers_license: "None",
    own_transport: false,
    languages: "",
    location: "",
    summary: "",
  });

  // Work Preferences
  const [preferences, setPreferences] = useState({
    preferred_job_type: "Any",
    preferred_industry: "",
    preferred_location: "",
    salary_expectation: "",
    availability: "Immediately",
    currently_employed: "No",
    notice_period: "Not applicable",
  });

  // Work History
  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
  const [newWork, setNewWork] = useState<WorkHistory>({
    company: "", job_title: "", start_date: "",
    end_date: "", current_job: false, responsibilities: "",
  });
  const [showWorkForm, setShowWorkForm] = useState(false);

  // Education
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [newEdu, setNewEdu] = useState<Education>({
    institution: "", qualification: "", field_of_study: "",
    nqf_level: "", start_year: "", end_year: "", completed: true,
  });
  const [showEduForm, setShowEduForm] = useState(false);

  // Certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newCert, setNewCert] = useState<Certificate>({
    name: "", issuer: "", year: "",
  });
  const [showCertForm, setShowCertForm] = useState(false);

  // Skills
  const [skills, setSkills] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setUserId(user.id);

    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (p) {
      setPersonal({
        full_name: p.full_name || "",
        email: p.email || "",
        phone: p.phone || "",
        id_number: p.id_number || "",
        gender: p.gender || "",
        race: p.race || "",
        nationality: p.nationality || "South African",
        disability: p.disability || "None",
        drivers_license: p.drivers_license || "None",
        own_transport: p.own_transport || false,
        languages: p.languages || "",
        location: p.location || "",
        summary: p.summary || "",
      });
      setPreferences({
        preferred_job_type: p.preferred_job_type || "Any",
        preferred_industry: p.preferred_industry || "",
        preferred_location: p.preferred_location || "",
        salary_expectation: p.salary_expectation || "",
        availability: p.availability || "Immediately",
        currently_employed: p.currently_employed || "No",
        notice_period: p.notice_period || "Not applicable",
      });
      setSkills(p.current_skills || "");
    }

    const { data: wh } = await supabase.from("work_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (wh) setWorkHistory(wh);

    const { data: edu } = await supabase.from("education").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (edu) setEducationList(edu);

    const { data: certs } = await supabase.from("certificates").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (certs) setCertificates(certs);

    setLoading(false);
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    await supabase.from("profiles").update({
      ...personal,
      current_skills: skills,
    }).eq("id", userId);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    await supabase.from("profiles").update(preferences).eq("id", userId);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const handleAddWork = async () => {
    if (!newWork.company || !newWork.job_title) return;
    await supabase.from("work_history").insert({ ...newWork, user_id: userId });
    setNewWork({ company: "", job_title: "", start_date: "", end_date: "", current_job: false, responsibilities: "" });
    setShowWorkForm(false);
    loadProfile();
  };

  const handleDeleteWork = async (id: string) => {
    await supabase.from("work_history").delete().eq("id", id);
    loadProfile();
  };

  const handleAddEdu = async () => {
    if (!newEdu.institution || !newEdu.qualification) return;
    await supabase.from("education").insert({ ...newEdu, user_id: userId });
    setNewEdu({ institution: "", qualification: "", field_of_study: "", nqf_level: "", start_year: "", end_year: "", completed: true });
    setShowEduForm(false);
    loadProfile();
  };

  const handleDeleteEdu = async (id: string) => {
    await supabase.from("education").delete().eq("id", id);
    loadProfile();
  };

  const handleAddCert = async () => {
    if (!newCert.name) return;
    await supabase.from("certificates").insert({ ...newCert, user_id: userId });
    setNewCert({ name: "", issuer: "", year: "" });
    setShowCertForm(false);
    loadProfile();
  };

  const handleDeleteCert = async (id: string) => {
    await supabase.from("certificates").delete().eq("id", id);
    loadProfile();
  };

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "personal", label: "Personal", icon: "profile" },
    { key: "employment", label: "Employment", icon: "briefcase" },
    { key: "education", label: "Education", icon: "graduation" },
    { key: "preferences", label: "Preferences", icon: "settings" },
    { key: "documents", label: "Documents", icon: "folder" },
  ];

  const inputClass = "bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition w-full";
  const selectClass = "bg-[#0a0f1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-400 transition w-full";
  const labelClass = "text-xs text-slate-400 mb-1 block";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-blue-400 text-sm animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-5">
        <h1 className="text-2xl font-black mb-1">My Profile</h1>
        <p className="text-slate-400 text-sm">Complete your profile to get better job matches — like a PNet profile.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#111827] border border-white/10 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex-1 justify-center ${
                activeTab === tab.key
                  ? "bg-blue-400 text-[#0a0f1e]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon name={tab.icon as any} className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Saved Banner */}
        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Saved successfully!
          </div>
        )}

        {/* PERSONAL TAB */}
        {activeTab === "personal" && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div><label className={labelClass}>Full Name</label>
                <input className={inputClass} value={personal.full_name} onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })} placeholder="Full Name" /></div>

              <div><label className={labelClass}>Email</label>
                <input className={inputClass} value={personal.email} disabled /></div>

              <div><label className={labelClass}>Phone Number</label>
                <input className={inputClass} value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} placeholder="e.g. 082 000 0000" /></div>

              <div><label className={labelClass}>ID Number</label>
                <input className={inputClass} value={personal.id_number} onChange={(e) => setPersonal({ ...personal, id_number: e.target.value })} placeholder="SA ID Number" /></div>

              <div><label className={labelClass}>Gender</label>
                <select className={selectClass} value={personal.gender} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}>
                  <option value="">Select</option>
                  {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => <option key={g}>{g}</option>)}
                </select></div>

              <div><label className={labelClass}>Race (EE Purposes)</label>
                <select className={selectClass} value={personal.race} onChange={(e) => setPersonal({ ...personal, race: e.target.value })}>
                  <option value="">Select</option>
                  {["African", "Coloured", "Indian/Asian", "White", "Prefer not to say"].map((r) => <option key={r}>{r}</option>)}
                </select></div>

              <div><label className={labelClass}>Nationality</label>
                <input className={inputClass} value={personal.nationality} onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })} /></div>

              <div><label className={labelClass}>Disability</label>
                <select className={selectClass} value={personal.disability} onChange={(e) => setPersonal({ ...personal, disability: e.target.value })}>
                  {["None", "Visual", "Hearing", "Physical", "Intellectual", "Other"].map((d) => <option key={d}>{d}</option>)}
                </select></div>

              <div><label className={labelClass}>Driver's License</label>
                <select className={selectClass} value={personal.drivers_license} onChange={(e) => setPersonal({ ...personal, drivers_license: e.target.value })}>
                  {["None", "Code 8", "Code 10", "Code 14", "Code B", "Code C", "Code EC"].map((d) => <option key={d}>{d}</option>)}
                </select></div>

              <div><label className={labelClass}>Own Transport</label>
                <select className={selectClass} value={personal.own_transport ? "Yes" : "No"} onChange={(e) => setPersonal({ ...personal, own_transport: e.target.value === "Yes" })}>
                  <option>No</option>
                  <option>Yes</option>
                </select></div>

              <div><label className={labelClass}>Current Location</label>
                <input className={inputClass} value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} placeholder="e.g. Durban, KwaZulu-Natal" /></div>

              <div><label className={labelClass}>Languages Spoken</label>
                <input className={inputClass} value={personal.languages} onChange={(e) => setPersonal({ ...personal, languages: e.target.value })} placeholder="e.g. English, Zulu, Xhosa" /></div>

              <div className="md:col-span-2"><label className={labelClass}>Skills (comma separated)</label>
                <input className={inputClass} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, Communication, Microsoft Office" /></div>

              <div className="md:col-span-2"><label className={labelClass}>Professional Summary</label>
                <textarea className={inputClass} rows={4} value={personal.summary} onChange={(e) => setPersonal({ ...personal, summary: e.target.value })} placeholder="Write a short professional summary about yourself..." /></div>

            </div>

            <button onClick={handleSavePersonal} disabled={saving} className="mt-6 bg-blue-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 w-full">
              {saving ? "Saving..." : "Save Personal Info →"}
            </button>
          </div>
        )}

        {/* EMPLOYMENT TAB */}
        {activeTab === "employment" && (
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h2 className="font-bold">Work History</h2>
              <button onClick={() => setShowWorkForm(true)} className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition">
                + Add Job
              </button>
            </div>

            {showWorkForm && (
              <div className="bg-[#111827] border border-blue-400/30 rounded-2xl p-5">
                <h3 className="font-medium text-sm mb-4">Add Work Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Company *</label>
                    <input className={inputClass} value={newWork.company} onChange={(e) => setNewWork({ ...newWork, company: e.target.value })} placeholder="Company name" /></div>
                  <div><label className={labelClass}>Job Title *</label>
                    <input className={inputClass} value={newWork.job_title} onChange={(e) => setNewWork({ ...newWork, job_title: e.target.value })} placeholder="Your role" /></div>
                  <div><label className={labelClass}>Start Date</label>
                    <input className={inputClass} type="month" value={newWork.start_date} onChange={(e) => setNewWork({ ...newWork, start_date: e.target.value })} /></div>
                  <div><label className={labelClass}>End Date</label>
                    <input className={inputClass} type="month" value={newWork.end_date} onChange={(e) => setNewWork({ ...newWork, end_date: e.target.value })} disabled={newWork.current_job} /></div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input type="checkbox" checked={newWork.current_job} onChange={(e) => setNewWork({ ...newWork, current_job: e.target.checked })} />
                    <label className="text-xs text-slate-400">I currently work here</label>
                  </div>
                  <div className="md:col-span-2"><label className={labelClass}>Responsibilities</label>
                    <textarea className={inputClass} rows={3} value={newWork.responsibilities} onChange={(e) => setNewWork({ ...newWork, responsibilities: e.target.value })} placeholder="Describe your responsibilities..." /></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddWork} className="bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-300 transition">Save</button>
                  <button onClick={() => setShowWorkForm(false)} className="border border-white/10 text-slate-400 px-5 py-2 rounded-lg text-sm hover:bg-white/5 transition">Cancel</button>
                </div>
              </div>
            )}

            {workHistory.length === 0 && !showWorkForm ? (
              <div className="text-center py-12 text-slate-500 bg-[#111827] border border-white/10 rounded-2xl">
                <div className="mb-3 text-slate-400"><Icon name="briefcase" className="w-10 h-10 mx-auto" /></div>
                <p className="text-sm">No work history yet. Add your first job!</p>
              </div>
            ) : (
              workHistory.map((w) => (
                <div key={w.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{w.job_title}</p>
                      <p className="text-slate-400 text-sm">{w.company}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {w.start_date} — {w.current_job ? "Present" : w.end_date}
                      </p>
                      {w.responsibilities && (
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">{w.responsibilities}</p>
                      )}
                    </div>
                    <button onClick={() => handleDeleteWork(w.id!)} className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h2 className="font-bold">Education</h2>
              <button onClick={() => setShowEduForm(true)} className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition">
                + Add Education
              </button>
            </div>

            {showEduForm && (
              <div className="bg-[#111827] border border-blue-400/30 rounded-2xl p-5">
                <h3 className="font-medium text-sm mb-4">Add Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Institution *</label>
                    <input className={inputClass} value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="e.g. UKZN, Damelin, TVET College" /></div>
                  <div><label className={labelClass}>Qualification *</label>
                    <input className={inputClass} value={newEdu.qualification} onChange={(e) => setNewEdu({ ...newEdu, qualification: e.target.value })} placeholder="e.g. Diploma, Degree, Matric" /></div>
                  <div><label className={labelClass}>Field of Study</label>
                    <input className={inputClass} value={newEdu.field_of_study} onChange={(e) => setNewEdu({ ...newEdu, field_of_study: e.target.value })} placeholder="e.g. Computer Science" /></div>
                  <div><label className={labelClass}>NQF Level</label>
                    <select className={selectClass} value={newEdu.nqf_level} onChange={(e) => setNewEdu({ ...newEdu, nqf_level: e.target.value })}>
                      <option value="">Select NQF Level</option>
                      {["NQF 1", "NQF 2", "NQF 3", "NQF 4 (Matric)", "NQF 5", "NQF 6 (Diploma)", "NQF 7 (Degree)", "NQF 8", "NQF 9", "NQF 10 (PhD)"].map((n) => <option key={n}>{n}</option>)}
                    </select></div>
                  <div><label className={labelClass}>Start Year</label>
                    <input className={inputClass} value={newEdu.start_year} onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} placeholder="e.g. 2020" /></div>
                  <div><label className={labelClass}>End Year</label>
                    <input className={inputClass} value={newEdu.end_year} onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} placeholder="e.g. 2023" /></div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={newEdu.completed} onChange={(e) => setNewEdu({ ...newEdu, completed: e.target.checked })} />
                    <label className="text-xs text-slate-400">Completed</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddEdu} className="bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-300 transition">Save</button>
                  <button onClick={() => setShowEduForm(false)} className="border border-white/10 text-slate-400 px-5 py-2 rounded-lg text-sm hover:bg-white/5 transition">Cancel</button>
                </div>
              </div>
            )}

            {educationList.length === 0 && !showEduForm ? (
              <div className="text-center py-12 text-slate-500 bg-[#111827] border border-white/10 rounded-2xl">
                <div className="mb-3 text-slate-400"><Icon name="graduation" className="w-10 h-10 mx-auto" /></div>
                <p className="text-sm">No education added yet.</p>
              </div>
            ) : (
              educationList.map((e) => (
                <div key={e.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{e.qualification}</p>
                      <p className="text-slate-400 text-sm">{e.institution}</p>
                      {e.field_of_study && <p className="text-slate-500 text-xs mt-0.5">{e.field_of_study}</p>}
                      <p className="text-slate-500 text-xs mt-1">
                        {e.nqf_level && `${e.nqf_level} · `}{e.start_year} — {e.end_year} {e.completed ? "Completed" : "(In Progress)"}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteEdu(e.id!)} className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-6">Work Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div><label className={labelClass}>Preferred Job Type</label>
                <select className={selectClass} value={preferences.preferred_job_type} onChange={(e) => setPreferences({ ...preferences, preferred_job_type: e.target.value })}>
                  {["Any", "Permanent", "Contract", "Part-time", "Freelance", "Internship", "Learnership", "Graduate Programme"].map((t) => <option key={t}>{t}</option>)}
                </select></div>

              <div><label className={labelClass}>Preferred Industry</label>
                <input className={inputClass} value={preferences.preferred_industry} onChange={(e) => setPreferences({ ...preferences, preferred_industry: e.target.value })} placeholder="e.g. IT, Finance, Healthcare" /></div>

              <div><label className={labelClass}>Preferred Location</label>
                <input className={inputClass} value={preferences.preferred_location} onChange={(e) => setPreferences({ ...preferences, preferred_location: e.target.value })} placeholder="e.g. Johannesburg, Remote" /></div>

              <div><label className={labelClass}>Salary Expectation (per month)</label>
                <input className={inputClass} value={preferences.salary_expectation} onChange={(e) => setPreferences({ ...preferences, salary_expectation: e.target.value })} placeholder="e.g. R15 000 - R20 000" /></div>

              <div><label className={labelClass}>Availability</label>
                <select className={selectClass} value={preferences.availability} onChange={(e) => setPreferences({ ...preferences, availability: e.target.value })}>
                  {["Immediately", "1 week", "2 weeks", "1 month", "2 months", "3 months"].map((a) => <option key={a}>{a}</option>)}
                </select></div>

              <div><label className={labelClass}>Currently Employed</label>
                <select className={selectClass} value={preferences.currently_employed} onChange={(e) => setPreferences({ ...preferences, currently_employed: e.target.value })}>
                  <option>No</option>
                  <option>Yes</option>
                </select></div>

              <div><label className={labelClass}>Notice Period</label>
                <select className={selectClass} value={preferences.notice_period} onChange={(e) => setPreferences({ ...preferences, notice_period: e.target.value })}>
                  {["Not applicable", "1 week", "2 weeks", "1 month", "2 months", "3 months"].map((n) => <option key={n}>{n}</option>)}
                </select></div>

            </div>

            <button onClick={handleSavePreferences} disabled={saving} className="mt-6 bg-blue-400 text-[#0a0f1e] font-bold px-6 py-3 rounded-lg text-sm hover:bg-blue-300 transition disabled:opacity-50 w-full">
              {saving ? "Saving..." : "Save Preferences →"}
            </button>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Certificates & Documents</h2>

            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">Add your certificates and qualifications</p>
              <button onClick={() => setShowCertForm(true)} className="text-xs bg-blue-400 text-[#0a0f1e] font-bold px-4 py-2 rounded-lg hover:bg-blue-300 transition">
                + Add Certificate
              </button>
            </div>

            {showCertForm && (
              <div className="bg-[#111827] border border-blue-400/30 rounded-2xl p-5">
                <h3 className="font-medium text-sm mb-4">Add Certificate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><label className={labelClass}>Certificate Name *</label>
                    <input className={inputClass} value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} placeholder="e.g. AWS Certified Developer" /></div>
                  <div><label className={labelClass}>Issuer</label>
                    <input className={inputClass} value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} placeholder="e.g. Amazon, Google, SETA" /></div>
                  <div><label className={labelClass}>Year</label>
                    <input className={inputClass} value={newCert.year} onChange={(e) => setNewCert({ ...newCert, year: e.target.value })} placeholder="e.g. 2023" /></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddCert} className="bg-blue-400 text-[#0a0f1e] font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-300 transition">Save</button>
                  <button onClick={() => setShowCertForm(false)} className="border border-white/10 text-slate-400 px-5 py-2 rounded-lg text-sm hover:bg-white/5 transition">Cancel</button>
                </div>
              </div>
            )}

            {certificates.length === 0 && !showCertForm ? (
              <div className="text-center py-12 text-slate-500 bg-[#111827] border border-white/10 rounded-2xl">
                <div className="mb-3 text-slate-400"><Icon name="folder" className="w-10 h-10 mx-auto" /></div>
                <p className="text-sm">No certificates added yet.</p>
              </div>
            ) : (
              certificates.map((c) => (
                <div key={c.id} className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.issuer} {c.year && `· ${c.year}`}</p>
                  </div>
                  <button onClick={() => handleDeleteCert(c.id!)} className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </main>
  );
}