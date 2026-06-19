import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history, profile } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const systemContext = `You are LYO-AI, a friendly and knowledgeable South African career assistant. You help young South Africans find jobs, improve their CVs, prepare for interviews, and navigate the job market.

${profile?.full_name ? `You are talking to ${profile.full_name}.` : ""}
${profile?.current_skills ? `Their skills are: ${profile.current_skills}.` : ""}
${profile?.target_role ? `Their target role is: ${profile.target_role}.` : ""}
${profile?.location ? `They are based in ${profile.location}.` : ""}
${profile?.experience ? `They have ${profile.experience} years of experience.` : ""}

Key knowledge:
- South African job market, NQF levels, SETA learnerships
- Local companies: Capitec, Discovery, MTN, Vodacom, Sasol, Eskom, Standard Bank, FNB, Nedbank, Old Mutual, Absa
- SA youth unemployment challenges
- DPSA government jobs
- Harambee, SAYouth.mobi, YES Programme
- LYO-AI features: CV Diagnostic, CV Auto-Fixer, Job Discovery, Gap Analyzer, Career Roadmap, Interview Coach, Cover Letter Generator, Application Tracker

Keep responses concise, friendly and practical. Use bullet points for lists. Never use emojis excessively.`;

    // Build conversation history for Gemini
    const conversationHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemContext }],
          },
          contents: [
            ...conversationHistory,
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}