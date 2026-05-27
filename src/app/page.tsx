import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#e06080";

const logEntries = [
  {
    t: "14:23",
    body: "Detected hot service: user-profile-svc (latency p99: 840ms)",
    tone: "warn",
  },
  {
    t: "14:24",
    body: "Proposing split: read-path / write-path",
    tone: "info",
  },
  {
    t: "14:24",
    body: "Lodestar verifying parity... PROVEN",
    tone: "ok",
  },
  {
    t: "14:25",
    body: "Axiom checking constraints... PASSED",
    tone: "ok",
  },
  {
    t: "14:26",
    body: "Deploying with canary 5%...",
    tone: "info",
  },
  {
    t: "14:31",
    body: "Promoting to 100%. p99: 290ms.",
    tone: "ok",
  },
] as const;

function AaltoMark({ size = 22 }: { size?: number }) {
  // Stacked waves
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    >
      <path d="M3 11 C 8 6, 14 16, 19 11 S 28 6, 29 11" />
      <path d="M3 17 C 8 12, 14 22, 19 17 S 28 12, 29 17" opacity="0.7" />
      <path d="M3 23 C 8 18, 14 28, 19 23 S 28 18, 29 23" opacity="0.4" />
    </svg>
  );
}

function ServiceBox({
  label,
  rps,
  status,
}: {
  label: string;
  rps: string;
  status: "hot" | "warm" | "cool" | "cache";
}) {
  const tone =
    status === "hot"
      ? { border: `${ACCENT}aa`, color: ACCENT, dot: ACCENT, sub: "p99 840ms" }
      : status === "warm"
      ? { border: `${ACCENT}55`, color: "#fff", dot: ACCENT, sub: "p99 320ms" }
      : status === "cache"
      ? { border: "rgba(255,255,255,0.25)", color: "#fff", dot: "#9ad", sub: "hit 86%" }
      : { border: "rgba(255,255,255,0.18)", color: "#fff", dot: "#8c8", sub: "p99 290ms" };

  return (
    <div
      className="rounded-md border bg-[#0d0d0d] px-3 py-3 min-w-[140px]"
      style={{ borderColor: tone.border }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
          {label}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: tone.dot }}
        />
      </div>
      <div
        className="mt-2 font-mono text-sm"
        style={{ color: tone.color }}
      >
        {rps}
      </div>
      <div className="mt-1 font-mono text-[10px] text-white/40">
        {tone.sub}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e06080]/30">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <AaltoMark size={22} />
            <div className="flex flex-col leading-tight">
              <span
                className="text-base"
                style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
              >
                {appConfig.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                aalto.fi &middot; Helsinki
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Infrastructure layer
            </span>
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm border rounded px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40 leading-relaxed">
              From Helsinki &mdash; named for Alvar Aalto,
              <br className="hidden sm:block" />
              architect of organic forms. <span style={{ color: ACCENT }}>aalto</span> means &ldquo;wave&rdquo; in Finnish.
              <br className="hidden sm:block" />
              Services rise and reshape like waves.
            </p>
            <h1
              className="mt-8 text-[5rem] sm:text-[7rem] lg:text-[8.5rem] leading-[0.95] tracking-[-0.04em]"
              style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
            >
              Aalto
            </h1>
            <p
              className="mt-6 text-xl sm:text-2xl text-white/70 max-w-xl"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              AI SRE that autonomously refactors its own service topology.
            </p>
            <p className="mt-6 max-w-xl text-base text-white/45 leading-relaxed">
              <span
                className="font-mono text-xs uppercase tracking-wider"
                style={{ color: ACCENT }}
              >
                The problem &mdash;
              </span>{" "}
              traffic shifts. Architecture doesn&rsquo;t. Aalto watches load,
              proposes splits and caches, proves parity, and redeploys the
              graph &mdash; without an outage.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
                style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
              >
                Connect a cluster
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                or sign in
              </Link>
            </div>
          </div>

          {/* Wave illustration */}
          <div className="lg:col-span-5 flex justify-center" style={{ color: ACCENT }}>
            <svg
              viewBox="0 0 320 320"
              className="w-64 sm:w-80 opacity-90"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <path
                  key={i}
                  d={`M 10 ${60 + i * 16} C 70 ${40 + i * 14}, 130 ${100 + i * 12}, 190 ${60 + i * 14} S 290 ${30 + i * 12}, 310 ${70 + i * 14}`}
                  opacity={1 - i * 0.06}
                  strokeWidth={1 - i * 0.04}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Before / After topology */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              A refactor in two diagrams
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl tracking-tight max-w-2xl"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              user-profile-svc, before and after Aalto.
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-wider text-white/30">
            100k req/s &middot; p99 latency
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Before */}
          <div className="rounded-md border bg-[#0d0d0d] p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Before
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: ACCENT }}>
                hot path
              </span>
            </div>

            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  clients
                </div>
                <div className="font-mono text-xs" style={{ color: ACCENT }}>
                  &darr; 100k req/s
                </div>
                <ServiceBox label="user-profile-svc" rps="100k req/s" status="hot" />
              </div>
            </div>

            <div className="border-t border-white/5 mt-2 pt-4 grid grid-cols-3 gap-3">
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">p99</div>
                <div className="font-mono text-sm" style={{ color: ACCENT }}>840ms</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">err rate</div>
                <div className="font-mono text-sm text-white/80">1.8%</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">services</div>
                <div className="font-mono text-sm text-white/80">1</div>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-md border bg-[#0d0d0d] p-6"
            style={{ borderColor: `${ACCENT}55`, boxShadow: `0 12px 40px -10px ${ACCENT}30` }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
                After &middot; Aalto refactor
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                organic split
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 py-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                clients
              </div>
              <div className="font-mono text-xs text-white/60">
                &darr; 100k req/s
              </div>

              {/* Cache */}
              <ServiceBox label="edge-cache" rps="86% hit" status="cache" />

              {/* Split arrow */}
              <svg viewBox="0 0 160 36" className="w-44" fill="none" stroke={ACCENT} strokeWidth="1.2">
                <path d="M80 2 L 80 14 L 20 24 L 20 34" />
                <path d="M80 2 L 80 14 L 80 34" />
                <path d="M80 2 L 80 14 L 140 24 L 140 34" />
              </svg>

              <div className="grid grid-cols-3 gap-3 w-full">
                <ServiceBox label="read-path" rps="74k req/s" status="cool" />
                <ServiceBox label="profile-core" rps="14k req/s" status="warm" />
                <ServiceBox label="write-path" rps="12k req/s" status="cool" />
              </div>
            </div>

            <div className="border-t border-white/5 mt-5 pt-4 grid grid-cols-3 gap-3">
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">p99</div>
                <div className="font-mono text-sm" style={{ color: ACCENT }}>290ms</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">err rate</div>
                <div className="font-mono text-sm text-white/80">0.2%</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-white/35 uppercase tracking-wider">services</div>
                <div className="font-mono text-sm text-white/80">3 + cache</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 text-center">
          latency p99 down 60% &middot; zero downtime &middot; rollback armed
        </p>
      </section>

      {/* Refactor log */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: ACCENT }}
        >
          Refactor log
        </p>
        <h2
          className="mt-3 text-3xl sm:text-4xl tracking-tight max-w-2xl"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          Eight minutes from hot service to promoted refactor.
        </h2>

        <div
          className="mt-10 rounded-md border bg-[#080808] overflow-hidden"
          style={{ borderColor: `${ACCENT}33` }}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              aalto &middot; refactor #1407
            </span>
            <span className="font-mono text-[10px]" style={{ color: ACCENT }}>
              auto &middot; canary &middot; proven
            </span>
          </div>
          <pre className="px-4 py-5 overflow-x-auto font-mono text-[12px] leading-[1.8] text-white/85">
{logEntries
  .map((e) => `[${e.t}] ${e.body}`)
  .join("\n")}
          </pre>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden">
            <div className="bg-[#0d0d0d] p-10 text-center">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                640
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                refactors deployed
              </div>
            </div>
            <div className="bg-[#0d0d0d] p-10 text-center">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                0
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                outages
              </div>
            </div>
            <div className="bg-[#0d0d0d] p-10 text-center">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                &minus;47%
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                p99 latency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className="text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            Architecture should change as fast as traffic does.
          </h2>
          <p className="mt-4 text-white/50">
            Aalto reshapes your topology while production keeps serving.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
            >
              Connect a cluster
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <AaltoMark size={18} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              {appConfig.name} &middot; Helsinki &middot; aalto.fi
            </span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-white/5"
            style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
          >
            Part of the Aletheia stack
            <span aria-hidden>&#8599;</span>
          </a>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
          Infrastructure layer &middot; from Helsinki, services that move like waves
        </div>
      </footer>
    </div>
  );
}
