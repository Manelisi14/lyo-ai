import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetRole, currentSkills, experience } = await req.json();

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
                  text: `You are a South African career coach. Create a detailed career roadmap and return ONLY a JSON object with no extra text or markdown backticks.

Target Role: ${targetRole}
Current Skills: ${currentSkills || "None specified"}
Experience: ${experience} years

Return this exact JSON structure:
{
  "targetRole": "${targetRole}",
  "totalDuration": "<e.g. 6-12 months>",
  "summary": "<2 sentence overview of the journey>",
  "phases": [
    {
      "phase": 1,
      "title": "<phase title>",
      "duration": "<e.g. 4-6 weeks>",
      "skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "milestone": "<what they can do after this phase>"
    }
  ]
}

Create 4-6 phases. Make it practical and achievable for a South African job seeker. Reference local resources like SETA programmes, local bootcamps, or free online platforms where relevant.`,
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

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}