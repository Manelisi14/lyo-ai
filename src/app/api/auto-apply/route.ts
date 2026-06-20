import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { job, profile, workHistory } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Generate tailored CV
    const cvResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert South African CV writer. Rewrite this candidate's CV specifically tailored for this job. Include ALL real personal details.

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.fullDescription || job.description}

Candidate:
- Name: ${profile.full_name}
- Email: ${profile.email}
- Phone: ${profile.phone}
- Location: ${profile.location}
- Skills: ${profile.current_skills}
- Summary: ${profile.summary}

Work History:
${workHistory?.map((w: Record<string, string>) => `${w.job_title} at ${w.company} (${w.start_date} - ${w.current_job ? "Present" : w.end_date}): ${w.responsibilities}`).join("\n") || "No prior experience"}

Write a complete professional CV tailored for ${job.title} at ${job.company}.
Return ONLY the CV text.`,
            }],
          }],
          generationConfig: { temperature: 0.2, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    const cvData = await cvResponse.json();
    const tailoredCV = cvData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Generate cover letter
    const clResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a professional cover letter for ${profile.full_name} applying for ${job.title} at ${job.company}.

Job Description: ${job.fullDescription || job.description}
Candidate Skills: ${profile.current_skills}
Candidate Summary: ${profile.summary}
Location: ${profile.location}

Write a complete cover letter with contact details, proper greeting, 3 paragraphs and professional closing.
Return ONLY the cover letter text.`,
            }],
          }],
          generationConfig: { temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    const clData = await clResponse.json();
    const coverLetter = clData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Send email with everything
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f4f4f5; padding: 40px 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; }
  .header { background: #0a0f1e; padding: 32px; text-align: center; }
  .logo { font-size: 24px; font-weight: 900; color: #fff; }
  .logo span { color: #60a5fa; }
  .body { padding: 32px; }
  .match { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center; }
  .match-score { font-size: 36px; font-weight: 900; color: #16a34a; }
  .match-label { font-size: 13px; color: #166534; margin-top: 4px; }
  .job-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
  .job-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .job-sub { font-size: 13px; color: #64748b; }
  .btn { display: block; background: #60a5fa; color: #0a0f1e; text-decoration: none; text-align: center; padding: 16px 24px; border-radius: 12px; font-weight: 700; font-size: 15px; margin: 24px 0; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
  .content { background: #f8fafc; border-radius: 8px; padding: 16px; font-size: 12px; color: #334155; white-space: pre-wrap; line-height: 1.6; max-height: 300px; overflow: hidden; }
  .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">LYO<span>-AI</span></div>
  </div>
  <div class="body">
    <div class="match">
      <div class="match-score">${job.matchScore}% Match</div>
      <div class="match-label">This job is a great match for your profile!</div>
    </div>

    <div class="job-card">
      <div class="job-title">${job.title}</div>
      <div class="job-sub">${job.company} · ${job.location}</div>
      <div style="margin-top: 12px; font-size: 13px; color: #475569; line-height: 1.6;">${job.description}</div>
    </div>

    <p style="font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
      Hi ${profile.full_name.split(" ")[0]}, we found a <strong>${job.matchScore}% match</strong> for you!
      We have prepared your tailored CV and cover letter. Click the button below to go directly to the application page.
    </p>

    <a href="${job.applyUrl}" class="btn">
      Apply Now at ${job.company} →
    </a>

    <div class="section">
      <div class="section-title">Your Tailored CV (Preview)</div>
      <div class="content">${tailoredCV.slice(0, 800)}...</div>
    </div>

    <div class="section">
      <div class="section-title">Your Cover Letter (Preview)</div>
      <div class="content">${coverLetter.slice(0, 600)}...</div>
    </div>

    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
      Log in to LYO-AI to download your full tailored CV and cover letter as PDF.
    </p>

    <a href="https://lyo-ai-bu52.vercel.app/dashboard/cv-fixer" style="display: block; text-align: center; color: #60a5fa; font-size: 13px; margin-top: 12px; text-decoration: none;">
      Download Full CV & Cover Letter →
    </a>
  </div>
  <div class="footer">
    LYO-AI · Your AI Career Companion · South Africa
  </div>
</div>
</body>
</html>`;

    await resend.emails.send({
      from: `LYO-AI <${process.env.RESEND_FROM_EMAIL}>`,
      to: profile.email,
      subject: `${job.matchScore}% Match: ${job.title} at ${job.company} — Your CV & Cover Letter Ready`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      tailoredCV,
      coverLetter,
    });

  } catch (err) {
    console.error("Auto-apply error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}