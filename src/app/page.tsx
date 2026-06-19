import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden text-center px-6 pt-28 pb-20 border-b border-slate-800 bg-sa-hero">
        <div className="pointer-events-none absolute left-0 top-8 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-40 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-block bg-slate-900 border border-slate-800 text-slate-400 text-xs tracking-[0.24em] uppercase px-4 py-2 rounded-full mb-6">
            Built for South African learners
          </span>
          <h1 className="text-5xl font-semibold leading-tight max-w-4xl mx-auto mb-4">
            Your AI-powered career growth platform
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Improve your CV, discover matched roles, and manage applications in a single polished workspace.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="bg-blue-500 text-slate-950 font-semibold px-7 py-3 rounded-full text-sm hover:bg-blue-400 transition">
              Get started
            </button>
            <button className="border border-slate-700 text-slate-200 px-7 py-3 rounded-full text-sm hover:bg-slate-900 transition">
              Explore the platform
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-800 px-6 py-10">
        {[
          { num: "32%", label: "SA youth unemployment" },
          { num: "78%", label: "CVs fail ATS checks" },
          { num: "10x", label: "Faster application workflow" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-3xl font-semibold text-blue-400">{s.num}</div>
            <div className="text-sm uppercase tracking-[0.18em] text-slate-500 mt-3">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Everything you need to get hired</h2>
            <p className="text-slate-500 text-sm max-w-xl">15 AI-powered tools for your resume, applications, and interview readiness.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "ATS Diagnostic", desc: "Score your CV and uncover weak spots." },
            { title: "CV Auto-Fixer", desc: "Rewrite your CV for stronger impact." },
            { title: "Job Discovery", desc: "Find curated opportunities quickly." },
            { title: "Employability Score", desc: "Track readiness for your next role." },
            { title: "Career Roadmap", desc: "Turn goals into a clear action plan." },
            { title: "Interview Coach", desc: "Prepare with role-specific guidance." },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-100 mb-3">{f.title}</div>
              <div className="text-sm text-slate-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">How it works</h2>
            <p className="text-slate-500 text-sm">Get hired in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Upload your CV", desc: "Start with your existing CV or use our templates." },
              { step: "02", title: "Get your score", desc: "See where you stand and what to improve." },
              { step: "03", title: "Fix & optimize", desc: "Improve your CV and close skills gaps." },
              { step: "04", title: "Apply & track", desc: "Manage opportunities from shortlist to offer." },
            ].map((s) => (
              <div key={s.step} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="text-blue-400 font-semibold text-3xl mb-4">{s.step}</div>
                <div className="font-semibold text-sm mb-2">{s.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16 border-t border-slate-800 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to build your career?</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
          Start using LYO-AI to convert your experience into a competitive job application.
        </p>
        <button className="bg-blue-500 text-slate-950 font-semibold px-8 py-3 rounded-full text-sm hover:bg-blue-400 transition">
          Create free account
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-8 border-t border-slate-800">
        LYO-AI · Career development tools for South African learners.
      </footer>

    </main>
  );
}