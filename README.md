# LYO-AI

### Localized Youth Opportunity AI — an AI career companion for South African youth

**[Live demo →](https://lyo-ai-bu52.vercel.app/)**

LYO-AI helps young South Africans move from unemployment to employment. Instead of being just another job board, it acts as a full AI career assistant — fixing CVs, matching real jobs, generating tailored cover letters, and coaching users through interviews, all personalized to each person's profile.

Built solo, end to end: product design, full-stack development, AI integration, and deployment.

---

## Why I built this

South Africa has one of the highest youth unemployment rates in the world. Most job platforms list vacancies but don't help people become *employable* — they don't fix CVs that fail ATS systems, explain skill gaps, or prepare candidates for interviews. LYO-AI was built to close that gap using AI, for South African youth specifically (NQF levels, SETA learnerships, local companies, local context).

---

## Features

| Feature | What it does |
|---|---|
| **ATS CV Diagnostic** | Upload a CV (PDF, Word, or text) and get an AI-generated ATS score with specific, actionable fixes |
| **CV Auto-Fixer** | AI rewrites a complete, real CV — including the candidate's actual name and details — tailored to a specific job or opportunity type |
| **Cover Letter Generator** | Generates a personalized cover letter using the user's full profile and work history |
| **Real Job Feed** | Pulls live job, learnership, internship, and graduate programme listings from the Adzuna API with real apply links — not generated fiction |
| **Smart Match Scoring** | Every job is scored against the user's skills, target role, and location |
| **Auto-Apply** | For 80%+ matches, the system generates a tailored CV and cover letter automatically and emails the candidate a ready-to-apply package |
| **Career Gap Analyzer** | Compares current skills against a target role and recommends free/local courses to close the gap |
| **Career Roadmap** | Generates a phased, multi-month learning plan to reach a chosen career goal |
| **Interview Coach** | AI-generated mock interview questions (technical, behavioral, situational) with instant feedback on typed answers |
| **Application Tracker** | Tracks real applications — pulled directly from the job feed, not manually faked — through Applied → Interview → Offer |
| **Full Profile System** | PNet-style profile: personal details, work history, education, certificates, preferences |
| **AI Chat Assistant** | A floating assistant, aware of the user's full profile, available on every page |
| **Email Notifications** | Welcome emails and job match alerts via Resend |

---

## Tech stack

**Frontend**
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS

**Backend / Data**
- Supabase (Postgres, Auth, Row-Level Security)
- Next.js API routes (serverless functions)

**AI**
- Google Gemini 2.5 Flash — CV analysis, CV rewriting, cover letters, chat assistant, gap analysis, roadmaps, interview questions

**Integrations**
- Adzuna API — real South African job listings
- Resend — transactional email
- PDFShift — CV PDF generation
- pdfjs-dist / mammoth — parsing uploaded PDF and Word CVs

**Deployment**
- Vercel
- GitHub

---

## Architecture notes

- All AI prompts are server-side only (API routes) — no API keys are ever exposed to the browser.
- Job matching combines a skills/role/location heuristic with Gemini-generated scoring, then sorts results by match quality.
- Auto-Apply runs CV generation, cover letter generation, and email dispatch in a single server-side flow triggered from the job card.
- Supabase Row-Level Security ensures every table (`profiles`, `applications`, `saved_jobs`, `work_history`, `education`, `certificates`) is scoped strictly to the authenticated user.
- File uploads are parsed entirely client-side (PDF.js, Mammoth) before the extracted text is sent to the AI — no binary file storage required for analysis.

---

## Screenshots

*(Add screenshots here — dashboard, job feed, CV diagnostic, interview coach)*

---

## Running locally

```bash
git clone https://github.com/Manelisi14/lyo-ai.git
cd lyo-ai
npm install
```

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
PDFSHIFT_API_KEY=
```

```bash
npm run dev
```

---

## About me

I'm Manelisi Ntuli, a full-stack developer based in KwaZulu-Natal, South Africa, with a Diploma in ICT (Application Development) from Durban University of Technology. I build software aimed at solving real South African problems — youth unemployment and public service accessibility being the two I care about most.

**Other project:** [MuniClear](https://github.com/Manelisi14) — a full-stack municipal services platform built for uMhlathuze Local Municipality (.NET 8 + Angular 18), covering resident and admin dashboards, Stripe-based utility payments with webhook-driven token generation, and real-time updates via SignalR.

- LinkedIn: [Manelisi Ntuli](https://www.linkedin.com/in/manelisi-ntuli-7071b2331)
- Email: ntulimanelisi36@gmail.com

---

## License

This project is available for review and learning purposes. Reach out if you'd like to discuss using or building on it.