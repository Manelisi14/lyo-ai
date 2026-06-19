import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cvText } = await req.json();

    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json(
        { error: "No CV text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const prompt = `
You are a senior ATS specialist, recruiter, career coach, and employability analyst specializing in South African job seekers.

Your task is to perform a professional ATS audit of the CV provided.

Evaluate:

1. ATS Compatibility
2. Contact Information Completeness
3. Professional Summary Quality
4. Skills Section Quality
5. Education Quality
6. Work Experience Quality
7. Achievement-Based Writing
8. Keyword Coverage
9. Formatting & Readability
10. Overall Employability

Scoring Rules:

ATS Score (0-100):
- Formatting: 20 points
- Contact Information: 10 points
- Skills: 15 points
- Education: 15 points
- Experience: 20 points
- Keywords: 20 points

Employability Score (0-100):
Evaluate how employable the candidate appears based on:
- Qualifications
- Skills
- Experience
- Professional presentation
- Market readiness

Severity Levels:
- high
- medium
- low

Return ONLY valid JSON.

{
  "ats_score": 0,
  "employability_score": 0,
  "summary": "",
  "recruiter_verdict": "",
  "strengths": [],
  "critical_issues": [],
  "formatting_issues": [],
  "missing_sections": [],
  "recommendations": [],
  "keywords_missing": [],
  "skills_detected": [],
  "education_analysis": "",
  "experience_analysis": "",
  "recruiter_view": {
    "strengths": [],
    "concerns": []
  },
  "issues": [
    {
      "section": "",
      "severity": "",
      "message": "",
      "fix": ""
    }
  ]
}

CV CONTENT:

${cvText}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 4096,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        {
          error: data.error.message,
        },
        { status: 500 }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        {
          error: "No response received from Gemini",
          raw: data,
        },
        { status: 500 }
      );
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      console.error("JSON Parse Error:", error);

      return NextResponse.json(
        {
          error: "Gemini returned invalid JSON",
          rawResponse: cleaned,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("ATS Analysis Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}