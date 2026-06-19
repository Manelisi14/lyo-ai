import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { currentSkills, targetRole, experience } = await req.json();

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
                  text: `You are a South African career advisor. Analyze the career gap for this person and return ONLY a JSON object with no extra text or markdown backticks.

Target Role: ${targetRole}
Current Skills: ${currentSkills}
Years of Experience: ${experience}

Return this exact JSON structure:
{
  "currentMatch": <number 0-100>,
  "targetRole": "${targetRole}",
  "presentSkills": ["<skill they have 1>", "<skill 2>", "<skill 3>"],
  "missingSkills": ["<missing skill 1>", "<missing 2>", "<missing 3>", "<missing 4>", "<missing 5>"],
  "recommendedCourses": [
    {
      "name": "<course name>",
      "provider": "<Coursera | Udemy | FreeCodeCamp | YouTube | MICT SETA | merSETA>",
      "url": "https://...",
      "free": <true|false>
    }
  ],
  "summary": "<2 sentence honest assessment of their readiness>",
  "timeToReady": "<e.g. 3-6 months | 6-12 months>"
}

Include at least 4 recommended courses. Prefer free South African resources where possible.`,
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