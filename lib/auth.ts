import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./prisma";
import { hashOtp, normalizeEmail } from "./otp";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "OTP Code", type: "text" }
      },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email ?? ""));
        if (!email) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || user.status !== "ACTIVE") return null;

        if (user.role === "ADMIN") {
          if (!credentials?.code) return null;
          const record = await db.emailOtp.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
          if (!record || record.expiresAt < new Date()) return null;
          if (record.attempts >= 5) return null;
          if (record.codeHash !== hashOtp(String(credentials.code))) {
            await db.emailOtp.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
            return null;
          }
          await db.emailOtp.delete({ where: { id: record.id } });
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }

        const password = String(credentials?.password ?? "");
        if (!password) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "CUSTOMER" | "SELLER" | "ADMIN";
      }
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
