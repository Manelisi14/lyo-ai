import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cvText, profile } = await req.json();

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.6; color: #000; margin: 40px; }
  h1 { font-size: 20px; margin-bottom: 4px; color: #1a1a2e; }
  h2 { font-size: 13px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 16px; color: #1a1a2e; text-transform: uppercase; letter-spacing: 1px; }
  p { margin: 3px 0; }
  .contact { font-size: 10px; color: #555; margin-bottom: 12px; }
  pre { font-family: Arial, sans-serif; font-size: 11px; white-space: pre-wrap; line-height: 1.6; }
</style>
</head>
<body>
<pre>${cvText}</pre>
</body>
</html>`;

    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`api:${process.env.PDFSHIFT_API_KEY}`).toString("base64"),
      },
      body: JSON.stringify({
        source: html,
        landscape: false,
        use_print: false,
      }),
    });

    if (!pdfResponse.ok) {
      throw new Error("PDF generation failed");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${profile?.full_name || "CV"}_LYO-AI.pdf"`,
      },
    });

  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}