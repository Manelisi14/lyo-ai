import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { welcomeEmail, jobAlertEmail } from "@/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { type, to, name, jobs } = await req.json();

    if (!to || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let subject = "";
    let html = "";

    if (type === "welcome") {
      subject = `Welcome to LYO-AI, ${name}! Your career journey starts now`;
      html = welcomeEmail(name);
    } else if (type === "job_alert") {
      subject = `${jobs?.length || 0} new opportunities matched to your profile`;
      html = jobAlertEmail(name, jobs || []);
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: `LYO-AI <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}