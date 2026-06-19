import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cvText, profile, jobType, jobTitle } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

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
                  text: `You are an expert South African CV writer. Rewrite this CV completely — include the person's actual name, contact details, and all personal information. Do not leave placeholders. Write it as a complete, real, professional CV exactly as it would appear when sent to an employer.

${profile ? `
Candidate Profile:
- Full Name: ${profile.full_name}
- Email: ${profile.email}
- Phone: ${profile.phone}
- Location: ${profile.location}
- Skills: ${profile.current_skills}
- Languages: ${profile.languages}
- Driver's License: ${profile.drivers_license}
` : ""}

${jobType ? `Target Job Type: ${jobType}` : ""}
${jobTitle ? `Target Job Title: ${jobTitle}` : ""}

Original CV Content:
${cvText}

Rules:
- Include the person's REAL name and contact details at the top
- Use proper South African CV format
- Include all sections: Personal Details, Professional Summary, Skills, Work Experience, Education, Additional Information
- Use strong action verbs
- Optimize keywords for ${jobType || "general"} positions in South Africa
- Fix ALL grammar and spelling errors
- Make it ATS-friendly
- Return ONLY the complete rewritten CV text, nothing else`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });

    const fixedCV = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ fixedCV });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}