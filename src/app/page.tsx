import Link from "next/link";

/* ────────────────────────────────────────────────────────────────────
   AALTO — THE DESIGN STUDIO
   Helsinki · Bauhaus / Scandinavian modernism. Big flat geometric
   shapes, organic wave curves ("aalto" = wave), asymmetric Mondrian
   bento. Bone (#f4f1ec), coral (#e06080) + mustard + deep teal.
──────────────────────────────────────────────────────────────────── */

const BONE = "#f4f1ec";
const INK = "#16140f";
const CORAL = "#e06080";
const MUSTARD = "#e8a93a";
const TEAL = "#1f6f6a";

const SANS =
  "'Helvetica Neue', 'Inter', 'Arial Nova', Helvetica, Arial, sans-serif";
const MONO = "'SF Mono', 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace";

const log: [string, string][] = [
  ["14:23", "hot service detected · user-profile (p99 840ms)"],
  ["14:24", "proposing split: read / write"],
  ["14:25", "Lodestar verifying parity… PROVEN"],
  ["14:26", "Axiom constraints… PASSED"],
  ["14:31", "promoted 100% · p99 290ms"],
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: BONE, color: INK, fontFamily: SANS }}
    >
      {/* ════════════════════ HERO — ASYMMETRIC + WAVE ════════════════════ */}
      <section className="relative">
        {/* The big organic coral WAVE sweeping across the top */}
        <svg
          className="absolute inset-x-0 top-0 h-[58vh] w-full"
          viewBox="0 0 1440 760"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden
        >
          <path
            d="M0,300 C220,180 360,420 600,360 C880,290 1040,120 1440,260 L1440,0 L0,0 Z"
            fill={CORAL}
          />
          <path
            d="M0,300 C220,180 360,420 600,360 C880,290 1040,120 1440,260"
            fill="none"
            stroke={MUSTARD}
            strokeWidth="6"
          />
          {/* a teal arc echoing the wave */}
          <circle cx="1180" cy="120" r="74" fill={TEAL} />
          <circle cx="1180" cy="120" r="74" fill="none" stroke={BONE} strokeWidth="4" />
        </svg>

        {/* Top bar — sign in / get started off to one side */}
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-sm font-black"
              style={{ backgroundColor: INK, color: BONE }}
            >
              Aa
            </span>
            <span
              className="text-lg font-black tracking-tight"
              style={{ color: BONE }}
            >
              AALTO
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm font-medium underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: BONE }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-5 py-2 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: INK, color: BONE }}
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Headline placed OFF-CENTER, overlapping the wave */}
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-28 sm:pt-40">
          <div className="max-w-3xl">
            <p
              className="mb-6 text-[11px] font-bold uppercase tracking-[0.4em]"
              style={{ fontFamily: MONO, color: BONE }}
            >
              Helsinki · aalto = wave
            </p>
            <h1
              className="text-5xl font-black leading-[0.92] tracking-[-0.03em] sm:text-7xl lg:text-[5.5rem]"
              style={{ color: INK }}
            >
              Architecture
              <br />
              that bends
              <br />
              <span style={{ color: CORAL }}>with the load.</span>
            </h1>
          </div>

          {/* Tagline + problem, set to the right as a counterweight */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-16">
            <div className="max-w-md">
              <p className="text-lg font-medium" style={{ color: INK }}>
                An AI SRE that autonomously refactors its own service topology —
                watching traffic, splitting hot paths, proving parity, and
                redeploying the graph without an outage.
              </p>
            </div>
            <div
              className="max-w-sm border-l-4 pl-5"
              style={{ borderColor: MUSTARD }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.3em]"
                style={{ fontFamily: MONO, color: TEAL }}
              >
                The problem
              </p>
              <p className="mt-2 text-2xl font-bold leading-tight">
                Traffic shifts. Architecture doesn&rsquo;t.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ MONDRIAN / BAUHAUS BENTO — DESIGN-LED GRID ════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {/* Asymmetric grid: 6-col, mixed spans, flat color blocks */}
        <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-6">
          {/* ── CENTERPIECE: BEFORE / AFTER topology in flat shapes ── */}
          <div
            className="rounded-3xl p-7 sm:col-span-4 sm:row-span-2"
            style={{ backgroundColor: INK, color: BONE }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">
                One refactor, drawn flat.
              </h2>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ fontFamily: MONO, color: CORAL }}
              >
                100k req/s
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1.4fr]">
              {/* BEFORE — one big coral circle */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 160 160" className="w-36 sm:w-40" aria-hidden>
                  <circle cx="80" cy="80" r="70" fill={CORAL} />
                  <text
                    x="80"
                    y="74"
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="13"
                    fontWeight="700"
                    fill={INK}
                  >
                    monolith
                  </text>
                  <text
                    x="80"
                    y="94"
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="12"
                    fill={INK}
                  >
                    p99 840ms
                  </text>
                </svg>
                <span
                  className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: "rgba(244,241,236,0.6)" }}
                >
                  Before · 1 service
                </span>
              </div>

              {/* connector */}
              <svg viewBox="0 0 60 40" className="hidden w-14 sm:block" aria-hidden>
                <line x1="2" y1="20" x2="46" y2="20" stroke={MUSTARD} strokeWidth="4" />
                <path d="M40 12 L54 20 L40 28 Z" fill={MUSTARD} />
              </svg>

              {/* AFTER — three smaller circles + a square (cache), connector lines */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 240 160" className="w-full max-w-[240px]" aria-hidden>
                  {/* connectors from a top hub */}
                  <line x1="120" y1="20" x2="40" y2="92" stroke="rgba(244,241,236,0.35)" strokeWidth="2" />
                  <line x1="120" y1="20" x2="120" y2="92" stroke="rgba(244,241,236,0.35)" strokeWidth="2" />
                  <line x1="120" y1="20" x2="200" y2="92" stroke="rgba(244,241,236,0.35)" strokeWidth="2" />
                  {/* cache square (hub) */}
                  <rect x="104" y="6" width="32" height="32" rx="5" fill={TEAL} />
                  {/* three service circles */}
                  <circle cx="40" cy="116" r="34" fill={MUSTARD} />
                  <circle cx="120" cy="116" r="34" fill={CORAL} />
                  <circle cx="200" cy="116" r="34" fill="#7fb5ad" />
                  <text x="40" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}>read</text>
                  <text x="120" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}>core</text>
                  <text x="200" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}>write</text>
                  <text x="120" y="26" textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700" fill={BONE}>cache</text>
                </svg>
                <span
                  className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: CORAL }}
                >
                  After · 3 services + cache · p99 290ms
                </span>
              </div>
            </div>
          </div>

          {/* ── TALL BLOCK: refactor log on a colored field ── */}
          <div
            className="rounded-3xl p-6 sm:col-span-2 sm:row-span-2"
            style={{ backgroundColor: TEAL, color: BONE }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-wider">
                Refactor log
              </span>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: MUSTARD }}
              />
            </div>
            <div className="mt-5 space-y-3" style={{ fontFamily: MONO }}>
              {log.map(([t, body]) => (
                <div key={t} className="text-[12px] leading-snug">
                  <span style={{ color: MUSTARD }}>[{t}]</span>{" "}
                  <span style={{ color: "rgba(244,241,236,0.92)" }}>{body}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-6 border-t pt-4 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ borderColor: "rgba(244,241,236,0.25)", fontFamily: MONO }}
            >
              auto · canary · proven · rollback armed
            </div>
          </div>

          {/* ── STAT TILES: bold flat-color squares with big numerals ── */}
          <div
            className="flex flex-col justify-between rounded-3xl p-6 sm:col-span-2"
            style={{ backgroundColor: CORAL, color: INK }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO }}
            >
              Refactors
            </span>
            <span className="mt-6 text-6xl font-black leading-none">640</span>
          </div>

          <div
            className="flex flex-col justify-between rounded-3xl p-6 sm:col-span-2"
            style={{ backgroundColor: MUSTARD, color: INK }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO }}
            >
              Outages
            </span>
            <span className="mt-6 text-6xl font-black leading-none">0</span>
          </div>

          <div
            className="flex flex-col justify-between rounded-3xl border-2 p-6 sm:col-span-2"
            style={{ backgroundColor: BONE, borderColor: INK, color: INK }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO, color: TEAL }}
            >
              p99 latency
            </span>
            <span className="mt-6 text-6xl font-black leading-none">
              &darr;47<span style={{ color: CORAL }}>%</span>
            </span>
          </div>
        </div>

        {/* A wide modernist statement bar — circles + bold type */}
        <div
          className="mt-4 flex flex-wrap items-center gap-6 rounded-3xl px-7 py-8"
          style={{ backgroundColor: INK, color: BONE }}
        >
          <svg viewBox="0 0 120 40" className="h-10 w-32 shrink-0" aria-hidden>
            <circle cx="20" cy="20" r="16" fill={CORAL} />
            <circle cx="52" cy="20" r="12" fill={MUSTARD} />
            <circle cx="80" cy="20" r="9" fill={TEAL} />
            <circle cx="104" cy="20" r="6" fill="#7fb5ad" />
          </svg>
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">
            Aalto reshapes the topology while production keeps serving.
          </p>
        </div>
      </section>

      {/* ════════════════════ WAVE-MOTIF FOOTER ════════════════════ */}
      <footer className="relative mt-8">
        {/* echo the hero curve, flipped, in coral */}
        <svg
          className="block h-32 w-full sm:h-44"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,120 C260,40 480,180 760,120 C1020,66 1180,160 1440,90 L1440,200 L0,200 Z"
            fill={CORAL}
          />
          <path
            d="M0,120 C260,40 480,180 760,120 C1020,66 1180,160 1440,90"
            fill="none"
            stroke={MUSTARD}
            strokeWidth="5"
          />
        </svg>

        <div style={{ backgroundColor: CORAL }}>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 pb-12 sm:flex-row sm:items-center">
            <div>
              <div
                className="text-3xl font-black tracking-tight"
                style={{ color: INK }}
              >
                AALTO
              </div>
              <div
                className="mt-1 text-[11px] font-bold uppercase tracking-[0.35em]"
                style={{ fontFamily: MONO, color: "rgba(22,20,15,0.7)" }}
              >
                Aalto · Helsinki · aalto.fi
              </div>
            </div>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.3em] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: INK, color: BONE, fontFamily: MONO }}
            >
              Part of the Aletheia stack &#8599;
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
