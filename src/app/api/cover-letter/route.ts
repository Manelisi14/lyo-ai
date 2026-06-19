import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { profile, workHistory, jobTitle, company, jobType, jobDescription } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const workExp = workHistory?.map((w: Record<string, string>) =>
      `${w.job_title} at ${w.company} (${w.start_date} - ${w.current_job ? "Present" : w.end_date}): ${w.responsibilities}`
    ).join("\n") || "No work experience listed";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert South African cover letter writer. Write a professional, personalized cover letter for this candidate.

Candidate Details:
- Full Name: ${profile.full_name}
- Email: ${profile.email}
- Phone: ${profile.phone}
- Location: ${profile.location}
- Skills: ${profile.current_skills}
- Professional Summary: ${profile.summary}

Work Experience:
${workExp}

Job Details:
- Job Title: ${jobTitle}
- Company: ${company || "the company"}
- Opportunity Type: ${jobType || "general position"}
${jobDescription ? `- Job Description: ${jobDescription}` : ""}

Write a complete cover letter that:
- Starts with the candidate's contact details and date
- Has a proper greeting
- Is 3-4 paragraphs long
- Highlights relevant skills and experience
- Shows enthusiasm for the South African company
- Ends with a professional closing
- Uses the candidate's REAL name throughout
- Is tailored specifically for ${jobType || "this position"}

Return ONLY the cover letter text, nothing else.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });

    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ coverLetter });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}