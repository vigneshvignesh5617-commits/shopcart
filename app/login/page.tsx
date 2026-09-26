"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result?.ok) {
      setError("Invalid email or password.");
      setBusy(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send code.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = await signIn("credentials", { email, code, redirect: false });
    if (!result?.ok) {
      setError("Invalid or expired verification code.");
      setBusy(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="container" style={{ maxWidth: 620, padding: "70px 0" }}>
      <div className="card">
        <h1>Welcome back</h1>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 10 }}>Customer / Seller</h3>
          {error && <div className="alert danger">{error}</div>}
          <form className="form" onSubmit={handlePasswordLogin}>
            <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" required /></div>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Admin</h3>
          {!sent ? (
            <form className="form" onSubmit={sendCode}>
              <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vigneshvignesh5617@gmail.com" required /></div>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send code"}</button>
            </form>
          ) : (
            <form className="form" onSubmit={verifyCode}>
              <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><label>Code</label><input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456" required /></div>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Verifying…" : "Verify"}</button>
              <button className="btn" type="button" onClick={() => { setSent(false); setCode(""); setError(""); }}>Change</button>
            </form>
          )}
        </div>

        <p className="muted" style={{ marginTop: 24 }}>Need the registration page? <Link href="/register">Register</Link></p>
      </div>
    </main>
  );
}
