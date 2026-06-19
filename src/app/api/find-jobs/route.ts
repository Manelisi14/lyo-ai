import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { skills, location, jobType } = await req.json();

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
                  text: `You are a South African job market expert. Generate 6 realistic job opportunities for someone with these details:

Skills/Field: ${skills}
Location: ${location || "South Africa"}
Type: ${jobType === "all" ? "mix of jobs, internships, learnerships, graduate programmes and bursaries" : jobType}

Return ONLY a JSON object with no extra text or markdown backticks.

{
  "jobs": [
    {
      "title": "<job title>",
      "company": "<realistic South African company name>",
      "location": "<city, South Africa>",
      "type": "<Job | Internship | Learnership | Graduate Programme | Bursary>",
      "description": "<2 sentence job description>",
      "requirements": ["<req 1>", "<req 2>", "<req 3>"],
      "applyUrl": "https://careers.example.co.za",
      "matchScore": <number 60-99>
    }
  ]
}

Use real South African companies like Capitec, Discovery, Shoprite, MTN, Sasol, Nedbank, Old Mutual, Pick n Pay, Vodacom, Standard Bank, FNB, Telkom, Eskom, Anglo American, etc.
Use real South African cities like Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth, Bloemfontein, etc.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
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