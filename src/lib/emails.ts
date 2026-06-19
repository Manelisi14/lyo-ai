export function welcomeEmail(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f4f4f5; padding: 40px 20px; }
  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
  .header { background: #0a0f1e; padding: 32px; text-align: center; }
  .logo { font-size: 28px; font-weight: 900; color: #ffffff; }
  .logo span { color: #60a5fa; }
  .tagline { color: #64748b; font-size: 13px; margin-top: 4px; }
  .body { padding: 32px; }
  .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
  .text { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 16px; }
  .features { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
  .feature { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #334155; }
  .feature:last-child { margin-bottom: 0; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #60a5fa; flex-shrink: 0; }
  .btn { display: block; background: #60a5fa; color: #0a0f1e; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin: 24px 0; }
  .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">LYO<span>-AI</span></div>
    <div class="tagline">Your AI Career Companion</div>
  </div>
  <div class="body">
    <p class="greeting">Welcome, ${name}! 🎉</p>
    <p class="text">
      You have just taken the first step toward your dream career. LYO-AI is here to help you
      move from unemployment to employment with the power of AI.
    </p>
    <div class="features">
      <div class="feature"><div class="dot"></div> ATS CV Diagnostic — fix your CV instantly</div>
      <div class="feature"><div class="dot"></div> Job Discovery — learnerships, bursaries and jobs</div>
      <div class="feature"><div class="dot"></div> Career Gap Analyzer — know exactly what to learn</div>
      <div class="feature"><div class="dot"></div> Interview Coach — practice before the real thing</div>
      <div class="feature"><div class="dot"></div> Cover Letter Generator — personalized for every job</div>
    </div>
    <p class="text">
      Start by completing your profile so we can match you with the best opportunities
      across South Africa.
    </p>
    <a href="https://lyo-ai.vercel.app/dashboard/profile" class="btn">
      Complete My Profile →
    </a>
    <p class="text" style="font-size: 13px; color: #94a3b8;">
      Built with love for South African youth. Together we fight unemployment.
    </p>
  </div>
  <div class="footer">
    LYO-AI · Localized Youth Opportunity AI · South Africa<br/>
    <span style="margin-top: 4px; display: block;">You received this because you signed up at lyo-ai.vercel.app</span>
  </div>
</div>
</body>
</html>
  `;
}

export function jobAlertEmail(name: string, jobs: {
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
}[]) {
  const jobCards = jobs.slice(0, 5).map((job) => `
    <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
      <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 4px;">${job.title}</div>
      <div style="font-size: 13px; color: #475569; margin-bottom: 8px;">${job.company} · ${job.location}</div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="background: #eff6ff; color: #2563eb; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 600;">${job.type}</span>
        <span style="background: #f0fdf4; color: #16a34a; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 600;">${job.matchScore}% match</span>
      </div>
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f4f4f5; padding: 40px 20px; }
  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
  .header { background: #0a0f1e; padding: 32px; text-align: center; }
  .logo { font-size: 28px; font-weight: 900; color: #ffffff; }
  .logo span { color: #60a5fa; }
  .body { padding: 32px; }
  .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .text { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 20px; }
  .btn { display: block; background: #60a5fa; color: #0a0f1e; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin: 24px 0; }
  .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">LYO<span>-AI</span></div>
  </div>
  <div class="body">
    <p class="greeting">New opportunities for you, ${name}!</p>
    <p class="text">We found ${jobs.length} new opportunities matched to your profile:</p>
    ${jobCards}
    <a href="https://lyo-ai.vercel.app/dashboard" class="btn">
      View All Opportunities →
    </a>
  </div>
  <div class="footer">
    LYO-AI · South Africa<br/>
    <span style="margin-top: 4px; display: block;">You received this because you have job alerts enabled.</span>
  </div>
</div>
</body>
</html>
  `;
}