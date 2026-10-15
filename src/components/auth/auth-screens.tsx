"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";

const primaryButton =
  "flex h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e2346f] via-[#f35177] to-[#ff9966] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(226,52,111,.32)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9aa9]";
const outlineButton =
  "flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-white/30 text-sm font-medium text-white/90 transition hover:border-white/50 hover:bg-white/[.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9aa9]";

function AuthBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1512 982"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="auth-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#262626" />
          <stop offset="55%" stopColor="#323232" />
          <stop offset="100%" stopColor="#242424" />
        </linearGradient>
        <linearGradient id="auth-right" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f2f2f" />
          <stop offset="100%" stopColor="#222" />
        </linearGradient>
        <linearGradient id="auth-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1d1d" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <filter id="auth-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="28" floodColor="#000" floodOpacity=".5" />
        </filter>
      </defs>
      <rect width="1512" height="982" fill="#1c1c1c" />
      <path
        filter="url(#auth-shadow)"
        fill="url(#auth-left)"
        d="M0 0H752C740 170 700 300 640 420C560 580 470 640 410 740C360 830 320 910 270 982H0Z"
      />
      <path
        filter="url(#auth-shadow)"
        fill="url(#auth-right)"
        d="M1475 0H1512V560C1440 520 1380 470 1330 400C1300 350 1300 290 1330 240C1380 160 1440 90 1475 0Z"
      />
      <path
        filter="url(#auth-shadow)"
        fill="url(#auth-hill)"
        d="M560 982C600 820 650 640 700 540C730 490 760 476 800 480C860 486 900 560 980 596C1060 632 1120 590 1160 520C1200 450 1260 400 1340 380C1420 360 1480 420 1512 470V982Z"
      />
    </svg>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#1c1c1c] px-4 font-sans text-white">
      <AuthBackground />
      <div className="relative z-10 flex w-full flex-1 flex-col items-center">{children}</div>
    </main>
  );
}

function Wordmark() {
  return (
    <Link href="/welcome" className="flex items-center gap-3" aria-label="Brinhildr home">
      <BrandMark className="w-[clamp(40px,4vw,54px)]" />
      <span className="text-[clamp(30px,3vw,44px)] font-semibold tracking-[-.02em]">Brinhildr</span>
    </Link>
  );
}

function UnderlineField({
  label,
  type = "text",
  name,
  autoComplete,
  placeholder,
}: {
  label: string;
  type?: string;
  name: string;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="block border-b border-white/25 pb-2 transition-colors focus-within:border-[#f35177]">
      <span className="block text-[10px] font-medium text-white/70">{label}</span>
      <input
        required
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/30"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.4a4.63 4.63 0 0 1-2 3.04v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.35Z" />
      <path d="M12 22c2.7 0 4.98-.9 6.64-2.42l-3.24-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.82-1.76-5.6-4.13H3.06v2.58A10 10 0 0 0 12 22Z" />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96L6.4 13.9Z" />
      <path d="M12 5.96c1.47 0 2.8.5 3.84 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.52L6.4 10.1C7.18 7.72 9.4 5.96 12 5.96Z" />
    </svg>
  );
}

function AuthCard({
  title,
  submitLabel,
  footer,
  children,
}: {
  title: string;
  submitLabel: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    router.push("/");
  }

  return (
    <section className="w-full max-w-[540px] rounded-[28px] border border-white/[.07] bg-gradient-to-br from-[#363636] to-[#2a2a2a] px-[clamp(20px,4.4vw,40px)] pb-10 pt-11 shadow-[0_40px_80px_rgba(0,0,0,.45)]">
      <h1 className="mb-8 text-center text-[30px] font-medium">{title}</h1>
      <form onSubmit={submit} className="space-y-6">
        {children}
        <button type="submit" disabled={submitting} className={`${primaryButton} disabled:opacity-70`}>
          {submitting ? "Signing you in…" : submitLabel}
        </button>
      </form>
      <div className="my-7 flex items-center gap-3 text-[11px] font-medium text-white/50">
        <span className="h-px flex-1 bg-white/15" />
        OR
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <button type="button" className={outlineButton} onClick={() => router.push("/")}>
        <GoogleIcon />
        {submitLabel} with Google
      </button>
      <p className="mt-8 text-center text-[13px] text-white/75">{footer}</p>
    </section>
  );
}

export function WelcomeScreen() {
  return (
    <AuthShell>
      <div className="flex flex-1 flex-col items-center justify-center pt-[12vh] text-center">
        <BrandMark className="w-[clamp(84px,8vw,118px)]" />
        <h1 className="mt-5 text-[clamp(40px,4vw,58px)] font-bold tracking-[-.02em]">Brinhildr</h1>
        <p className="mt-2 text-[clamp(20px,2vw,29px)] font-light text-white/90">Business. Done Smoothly.</p>
      </div>
      <div className="w-full max-w-[440px] space-y-7 pb-[14vh] pt-16">
        <Link href="/signup" className={primaryButton}>
          Get started
        </Link>
        <Link href="/login" className={outlineButton}>
          Login
        </Link>
      </div>
    </AuthShell>
  );
}

export function LoginScreen() {
  return (
    <AuthShell>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-12">
        <Wordmark />
        <AuthCard
          title="Login"
          submitLabel="Login"
          footer={
            <>
              Don’t have an account?{" "}
              <Link href="/signup" className="font-medium text-white underline underline-offset-4 hover:text-[#ff9aa9]">
                Sign up
              </Link>
            </>
          }
        >
          <UnderlineField
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <UnderlineField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          <label className="flex w-fit items-center gap-2.5 text-[13px] text-white/75">
            <input type="checkbox" name="remember" className="size-4 accent-[#f35177]" />
            Save my info
          </label>
        </AuthCard>
      </div>
    </AuthShell>
  );
}

export function SignupScreen() {
  return (
    <AuthShell>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-12">
        <Wordmark />
        <AuthCard
          title="Create account"
          submitLabel="Sign up"
          footer={
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-white underline underline-offset-4 hover:text-[#ff9aa9]">
                Login
              </Link>
            </>
          }
        >
          <UnderlineField label="Full Name" name="name" autoComplete="name" placeholder="Your name" />
          <UnderlineField
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <UnderlineField
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <label className="flex w-fit items-center gap-2.5 text-[13px] text-white/75">
            <input required type="checkbox" name="terms" className="size-4 accent-[#f35177]" />
            I agree to the Terms and Privacy Policy
          </label>
        </AuthCard>
      </div>
    </AuthShell>
  );
}
