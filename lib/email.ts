import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendLoginCode(email: string, code: string) {
  if (process.env.NODE_ENV !== "production" && process.env.DEV_OTP_MODE === "true") {
    console.log(`[DEV OTP] ${email}: ${code}`);
    return;
  }

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured. Add it to .env before sending real emails.");
  }

  const from = process.env.EMAIL_FROM || "Shopping Cart <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Your Shopping Cart verification code",
    text: `Your Shopping Cart verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><h2>Shopping Cart</h2><p>Your verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${code}</div><p>This code expires in 10 minutes.</p><p style="color:#666">If you did not request this code, you can ignore this email.</p></div>`
  });
  if (error) throw new Error(error.message);
}
