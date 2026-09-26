import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { generateOtp, hashOtp, normalizeEmail } from "@/lib/otp";
import { sendLoginCode } from "@/lib/email";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const email = normalizeEmail(body.email);
    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "OTP login is only available for admin accounts." }, { status: 403 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "This account is not active." }, { status: 403 });
    }

    const recent = await db.emailOtp.findFirst({ where: { email, createdAt: { gt: new Date(Date.now() - 60_000) } }, orderBy: { createdAt: "desc" } });
    if (recent) return NextResponse.json({ error: "Please wait 60 seconds before requesting another code." }, { status: 429 });

    const code = generateOtp();
    await db.emailOtp.deleteMany({ where: { email } });
    await db.emailOtp.create({ data: { email, codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 10 * 60_000) } });
    await sendLoginCode(email, code);
    return NextResponse.json({ ok: true, message: "Verification code sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send verification code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
