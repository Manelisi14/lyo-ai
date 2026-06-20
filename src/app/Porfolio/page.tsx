import Link from "next/link";

export const metadata = {
  title: "Manelisi Ntuli — Full-stack developer",
  description: "Full-stack developer building AI-powered career and civic tech for South Africa.",
};

const projects = [
  {
    name: "LYO-AI",
    status: "live",
    statusLabel: "in production",
    tagline: "AI career companion for South African youth",
    description:
      "A full AI employability platform — not a job board. Diagnoses and rewrites CVs, generates tailored cover letters, pulls real job listings from a live API, scores match quality, auto-applies on strong matches, and coaches users through interviews. Built solo, deployed, in active use.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "Gemini 2.5", "Adzuna API", "Resend"],
    metrics: [
      { value: "15+", label: "AI-powered tools" },
      { value: "100%", label: "real job links" },
      { value: "solo", label: "build" },
    ],
    links: [
      { label: "Live app", href: "https://lyo-ai-bu52.vercel.app/" },
      { label: "Source", href: "https://github.com/Manelisi14/lyo-ai" },
    ],
  },
  {
    name: "MuniClear",
    status: "built",
    statusLabel: "shipped",
    tagline: "Municipal services platform for uMhlathuze Local Municipality",
    description:
      "A resident and admin platform replacing manual municipal processes: utility account management, IBT/RBT tariff-aware billing, Stripe-based payments with webhook-driven token generation, and real-time updates via SignalR. Nine-module admin command centre built from scratch.",
    stack: [".NET 8", "Angular 18", "SQL Server", "Stripe", "SignalR"],
    metrics: [
      { value: "9", label: "admin modules" },
      { value: "401→0", label: "auth bugs resolved" },
      { value: "real-time", label: "billing sync" },
    ],
    links: [{ label: "Source", href: "https://github.com/Manelisi14" }],
  },
];

const stack = {
  "Languages": ["TypeScript", "C#", "Python", "JavaScript", "SQL"],
  "Frontend": ["Next.js", "React", "Angular", "Tailwind CSS"],
  "Backend": [".NET 8", "ASP.NET MVC", "Node.js", "REST APIs"],
  "Data & infra": ["Supabase", "PostgreSQL", "SQL Server", "Vercel", "SignalR"],
  "AI integration": ["Gemini API", "Prompt design", "AI-assisted product flows"],
};

export default function PortfolioPage() {
  return (
    <main style={{ background: "#0b0f14", color: "#f4f2ec", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>

        {/* Status rail */}
        <div
          style={{
            display: "flex",
            gap: 24,
            padding: "20px 0",
            borderBottom: "1px solid #1a1f26",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            color: "#8b8f98",
            flexWrap: "wrap",
          }}
        >
          {projects.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: p.status === "live" ? "#3ddc97" : "#8b8f98",
                  flexShrink: 0,
                }}
              />
              <span>{p.name} — {p.statusLabel}</span>
            </div>
          ))}
        </div>

        {/* Hero */}
        <section style={{ padding: "64px 0 48px" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              color: "#3ddc97",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            FULL-STACK DEVELOPER · SOUTH AFRICA
          </p>
          <h1
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 700,
              margin: "0 0 24px",
              letterSpacing: "-0.02em",
            }}
          >
            Manelisi Ntuli
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              lineHeight: 1.6,
              color: "#c9cdd3",
              maxWidth: 560,
              margin: "0 0 32px",
            }}
          >
            I build working software that solves problems I see around me — youth
            unemployment, broken municipal systems — and ship it end to end:
            product thinking, full-stack code, AI integration, deployment.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="https://lyo-ai-bu52.vercel.app/"
              style={{
                background: "#3ddc97",
                color: "#0b0f14",
                padding: "12px 20px",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View LYO-AI live →
            </a>
            <a
              href="https://github.com/Manelisi14"
              style={{
                border: "1px solid #2a313a",
                color: "#f4f2ec",
                padding: "12px 20px",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
            <a
              href="mailto:ntulimanelisi36@gmail.com"
              style={{
                border: "1px solid #2a313a",
                color: "#f4f2ec",
                padding: "12px 20px",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Email
            </a>
          </div>
        </section>

        {/* Projects */}
        <section style={{ padding: "32px 0" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              color: "#8b8f98",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            PROJECTS
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {projects.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "#11161d",
                  border: "1px solid #1a1f26",
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: 24,
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      {p.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        color: "#8b8f98",
                        margin: 0,
                      }}
                    >
                      {p.tagline}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      color: p.status === "live" ? "#3ddc97" : "#8b8f98",
                      border: `1px solid ${p.status === "live" ? "#1f4d3a" : "#2a313a"}`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.statusLabel}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#c9cdd3",
                    margin: "0 0 20px",
                  }}
                >
                  {p.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <p
                        style={{
                          fontFamily: "Space Grotesk, sans-serif",
                          fontSize: 20,
                          fontWeight: 700,
                          margin: "0 0 2px",
                          color: "#f4f2ec",
                        }}
                      >
                        {m.value}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          color: "#8b8f98",
                          margin: 0,
                        }}
                      >
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 11,
                        color: "#c9cdd3",
                        background: "#1a1f26",
                        borderRadius: 6,
                        padding: "4px 10px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#3ddc97",
                        textDecoration: "none",
                      }}
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section style={{ padding: "32px 0" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              color: "#8b8f98",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            HOW I BUILD
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 24,
            }}
          >
            {Object.entries(stack).map(([category, items]) => (
              <div key={category}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#f4f2ec",
                    margin: "0 0 10px",
                  }}
                >
                  {category}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        color: "#8b8f98",
                        marginBottom: 6,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section style={{ padding: "32px 0 64px" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              color: "#8b8f98",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            BACKGROUND
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: "#c9cdd3",
              maxWidth: 600,
              margin: "0 0 16px",
            }}
          >
            I hold a Diploma in ICT (Application Development) from Durban
            University of Technology, where I worked across C#, ASP.NET MVC,
            and SQL Server on real coursework systems — a gym membership
            platform, an order management system with automated cost logic,
            and a client-facing services site.
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: "#c9cdd3",
              maxWidth: 600,
              margin: "0 0 16px",
            }}
          >
            Since then I've moved fast: independently designing, building, and
            deploying two production-grade platforms — one a civic tech system
            for a real municipality, the other a full AI product with live
            integrations, real users, and a live URL. I care most about
            software that does something true for the person using it, not
            software that just demos well.
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: "#c9cdd3",
              maxWidth: 600,
              margin: 0,
            }}
          >
            Based in KwaZulu-Natal, South Africa. Open to opportunities in
            full-stack development, particularly where AI and real-world
            impact intersect.
          </p>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #1a1f26",
            padding: "24px 0 48px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            color: "#8b8f98",
          }}
        >
          <span>Manelisi Ntuli</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="https://github.com/Manelisi14" style={{ color: "#8b8f98", textDecoration: "none" }}>
              GitHub
            </a>
            <a href="mailto:ntulimanelisi36@gmail.com" style={{ color: "#8b8f98", textDecoration: "none" }}>
              Email
            </a>
            <Link href="/" style={{ color: "#8b8f98", textDecoration: "none" }}>
              LYO-AI home
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}