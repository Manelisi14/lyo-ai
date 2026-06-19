import { NextRequest, NextResponse } from "next/server";

async function callGemini(apiKey: string, body: object, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(
        `Unexpected non-JSON response from Gemini: ${text.slice(0, 200)}`
      );
    }

    if (data.error?.code === 503 || data.error?.message?.toLowerCase().includes("high demand")) {
      console.log(`Retry ${i + 1} of ${retries} — Gemini busy, waiting 3s...`);
      await new Promise((res) => setTimeout(res, 3000));
      continue;
    }

    if (!response.ok) {
      const message = data.error?.message || response.statusText || "Gemini request failed";
      throw new Error(`Gemini error: ${message}`);
    }

    return data;
  }

  throw new Error("Gemini is currently unavailable. Please try again in a moment.");
}

export async function POST(req: NextRequest) {
  try {
    const { jobRole, company, experience } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY!;

    const data = await callGemini(apiKey, {
      contents: [
        {
          parts: [
            {
              text: `You are a South African interview coach. Generate 8 realistic interview questions for this candidate and return ONLY a JSON object with no extra text or markdown backticks.

Job Role: ${jobRole}
Company: ${company || "a South African company"}
Experience: ${experience} years

Return this exact JSON:
{
  "questions": [
    {
      "question": "<interview question>",
      "type": "<Technical | Behavioral | Situational | General>",
      "tip": "<short tip on how to answer>",
      "sampleAnswer": "<a strong sample answer for this role>"
    }
  ]
}

Mix question types: 2 general, 2 behavioral, 2 situational, 2 technical.
Make questions relevant to South African workplace culture.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}