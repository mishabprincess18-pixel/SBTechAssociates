import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      return NextResponse.json({ ok: true, mocked: true });
    }
    const resend = new Resend(key);
    await resend.emails.send({
      from: "SB Tech <noreply@sbtech.example>",
      to: process.env.CONTACT_TO_EMAIL || "founder@example.com",
      subject: `New contact from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}