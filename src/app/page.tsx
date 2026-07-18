import Link from "next/link";

/* ────────────────────────────────────────────────────────────────────
   AALTO — THE DESIGN STUDIO
   Helsinki · Bauhaus / Scandinavian modernism. Big flat geometric
   shapes, organic wave curves ("aalto" = wave), asymmetric Mondrian
   bento. Five flat tokens only — no gradients, no soft shadows.
──────────────────────────────────────────────────────────────────── */

// ── The five-token palette (the page's spine) ────────────────────────
const BONE = "#f4f1ec";
const INK = "#16140f";
const CORAL = "#e06080";
const MUSTARD = "#e8a93a";
const TEAL = "#1f6f6a";
// Alpha variants of the same five hues (no new colors introduced).
const BONE_85 = "rgba(244,241,236,0.85)";
const BONE_60 = "rgba(244,241,236,0.6)";
const BONE_35 = "rgba(244,241,236,0.35)";
const BONE_25 = "rgba(244,241,236,0.25)";
const INK_90 = "rgba(22,20,15,0.9)";

const SANS =
  "'Helvetica Neue', 'Inter', 'Arial Nova', Helvetica, Arial, sans-serif";
const MONO = "'SF Mono', 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace";

type LogLine = { t: string; body: string; verdict?: string };
const log: LogLine[] = [
  { t: "14:23", body: "hot service detected · user-profile (p99 840ms)" },
  { t: "14:24", body: "proposing split: read / write" },
  { t: "14:25", body: "Lodestar verifying parity…", verdict: "PROVEN" },
  { t: "14:26", body: "Axiom constraints…", verdict: "PASSED" },
  { t: "14:31", body: "promoted 100% · p99 290ms" },
];

const stats: { label: string; sub: string; value: React.ReactNode; bg: string; fg: string; labelFg?: string; border?: boolean }[] = [
  { label: "Refactors", sub: "this quarter", value: "640", bg: CORAL, fg: INK },
  { label: "Outages", sub: "since launch", value: "0", bg: MUSTARD, fg: INK },
  {
    label: "P99 latency",
    sub: "median across fleet",
    value: (
      <>
        &darr;47<span style={{ color: CORAL }}>%</span>
      </>
    ),
    bg: BONE,
    fg: INK,
    labelFg: TEAL,
    border: true,
  },
];

// Static keyframes + motion + focus, injected as a plain <style> child.
// All entrance/idle motion is gated behind prefers-reduced-motion so the
// default (reduced) state is the final, fully-rendered composition.
const CSS = `
:where(a, button):focus-visible {
  outline: 2px solid ${INK};
  outline-offset: 2px;
  border-radius: 6px;
  box-shadow: 0 0 0 5px ${BONE_85};
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes a-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes a-reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  @keyframes a-pop { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
  @keyframes a-draw { from { stroke-dashoffset: 64; } to { stroke-dashoffset: 0; } }
  @keyframes a-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes a-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.78); } }

  /* Hero — entrance on load (document timeline). */
  .a-h1 { animation: a-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) both; }
  .a-h2 { animation: a-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.09s both; }
  .a-h3 { animation: a-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.18s both; }
  .a-h4 { animation: a-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.27s both; }
  .a-h5 { animation: a-rise 0.6s cubic-bezier(0.2,0.7,0.2,1) 0.36s both; }

  /* Below-the-fold — scroll-driven (view timeline). Duration stays auto so
     the timeline drives progress; cards stay present, only content animates. */
  .a-log {
    animation-name: a-reveal;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: view();
  }
  .a-log:nth-child(1) { animation-range: entry 2% entry 24%; }
  .a-log:nth-child(2) { animation-range: entry 9% entry 31%; }
  .a-log:nth-child(3) { animation-range: entry 16% entry 38%; }
  .a-log:nth-child(4) { animation-range: entry 23% entry 45%; }
  .a-log:nth-child(5) { animation-range: entry 30% entry 52%; }

  .a-dot { animation: a-pulse 2.4s ease-in-out infinite; }

  .a-pop {
    transform-box: fill-box;
    transform-origin: center;
    animation-name: a-pop;
    animation-timing-function: cubic-bezier(0.2,0.8,0.2,1);
    animation-fill-mode: both;
    animation-timeline: view();
  }
  .a-pop-1 { animation-range: entry 6% entry 26%; }
  .a-pop-2 { animation-range: entry 16% entry 36%; }
  .a-pop-3 { animation-range: entry 24% entry 44%; }
  .a-pop-4 { animation-range: entry 32% entry 52%; }
  .a-pop-5 { animation-range: entry 40% entry 60%; }

  .a-draw {
    animation-name: a-draw;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: view();
    animation-range: entry 12% entry 46%;
  }
  .a-arrowhead {
    animation-name: a-fade;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: view();
    animation-range: entry 42% entry 56%;
  }
  .a-num {
    animation-name: a-reveal;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: view();
    animation-range: entry 4% entry 32%;
  }

  /* Print-idiom micro-interactions (hard offset shadow, zero blur). */
  .a-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
  .a-card:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0 0 ${INK}; }
  .a-pill { transition: transform 0.16s ease, background-color 0.16s ease, color 0.16s ease; }
  .a-pill:hover { transform: translateY(-2px); }
  .a-statement:hover .a-sdot { transform: scale(1.15); }
  .a-sdot { transition: transform 0.16s ease; }
}
/* Color inversions (no motion) work in every mode. */
.a-getstarted:hover { background-color: ${CORAL}; color: ${INK}; }
.a-cta-coral:hover { background-color: ${INK}; color: ${BONE}; }
`;

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: BONE, color: INK, fontFamily: SANS }}
    >
      <style>{CSS}</style>

      {/* ════════════════════ HERO — ASYMMETRIC + WAVE ════════════════════ */}
      <section className="relative">
        {/* ── Coral field: nav, eyebrow, and the teal "sun" ── */}
        <div className="relative overflow-hidden" style={{ backgroundColor: CORAL }}>
          {/* Teal sun — sits low-right, clear of the nav, a true circle. */}
          <div
            className="pointer-events-none absolute right-5 top-24 z-0 sm:right-[7%] sm:top-16"
            aria-hidden
          >
            <svg
              viewBox="0 0 240 240"
              className="h-24 w-24 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
            >
              <path
                d="M28 92 A 100 100 0 0 1 212 92"
                fill="none"
                stroke={MUSTARD}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="126" r="80" fill={TEAL} />
              <circle
                cx="120"
                cy="126"
                r="80"
                fill="none"
                stroke={BONE}
                strokeWidth="4"
              />
            </svg>
          </div>

          <header>
            <nav
              aria-label="Main"
              className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-7"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-sm font-black"
                  style={{ backgroundColor: INK, color: BONE }}
                >
                  Aa
                </span>
                <span
                  className="text-lg font-black tracking-tight"
                  style={{ color: INK }}
                >
                  AALTO
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="a-pill inline-flex min-h-[44px] items-center rounded-full border-2 px-4 text-sm font-bold leading-none"
                  style={{ borderColor: INK, color: INK }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="a-pill a-getstarted inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-bold leading-none"
                  style={{ backgroundColor: INK, color: BONE }}
                >
                  Get started
                </Link>
              </div>
            </nav>
          </header>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
            <p
              className="a-h1 max-w-[16rem] text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] sm:max-w-none sm:text-[11px] sm:tracking-[0.4em]"
              style={{ fontFamily: MONO, color: INK }}
            >
              Helsinki · aalto = wave
            </p>
          </div>
        </div>

        {/* ── Wave divider: coral → bone, mustard contour ── */}
        <svg
          className="block h-16 w-full sm:h-28"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,0 L1440,0 L1440,58 C1180,150 1020,10 760,78 C520,140 300,30 0,84 Z"
            fill={CORAL}
          />
          <path
            d="M1440,58 C1180,150 1020,10 760,78 C520,140 300,30 0,84"
            fill="none"
            stroke={MUSTARD}
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* ── Bone content: headline (left) + counterweight (right) ── */}
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 sm:pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
            <h1
              className="a-h2 text-5xl font-black leading-[0.92] tracking-[-0.03em] sm:text-7xl lg:text-[5.5rem]"
              style={{ color: INK }}
            >
              Architecture
              <br />
              that bends
              <br />
              <span style={{ color: CORAL }}>with the load.</span>
            </h1>

            <div className="flex flex-col gap-8">
              <p className="a-h3 text-lg font-medium" style={{ color: INK }}>
                An AI SRE that autonomously refactors its own service topology —
                watching traffic, splitting hot paths, proving parity, and
                redeploying the graph without an outage.
              </p>
              <div
                className="a-h4 border-l-4 pl-5"
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
        </div>
      </section>

      {/* ════════════ MONDRIAN / BAUHAUS BENTO — DESIGN-LED GRID ════════════ */}
      <main className="mx-auto max-w-6xl px-6 pb-4">
        <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-6">
          {/* ── CENTERPIECE: BEFORE / AFTER topology in flat shapes ── */}
          <div
            className="a-card rounded-3xl p-7 sm:col-span-4 sm:row-span-2"
            style={{ backgroundColor: INK, color: BONE }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                One refactor, drawn flat.
              </h2>
              <span
                className="shrink-0 text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ fontFamily: MONO, color: CORAL }}
              >
                100k req/s
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-[1fr_auto_1.4fr]">
              {/* BEFORE — one big coral circle */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 160 160" className="w-36 sm:w-40" aria-hidden>
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill={CORAL}
                    className="a-pop a-pop-1"
                  />
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
                  className="mt-auto whitespace-nowrap pt-4 text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ fontFamily: MONO, color: BONE_60 }}
                >
                  Before · 1 service · p99 840ms
                </span>
              </div>

              {/* connector — horizontal on desktop, vertical on mobile */}
              <div className="flex items-center justify-center">
                <svg
                  viewBox="0 0 60 40"
                  className="hidden w-14 sm:block"
                  aria-hidden
                >
                  <line
                    x1="2"
                    y1="20"
                    x2="46"
                    y2="20"
                    stroke={MUSTARD}
                    strokeWidth="4"
                    strokeDasharray="64"
                    className="a-draw"
                  />
                  <path
                    d="M40 12 L54 20 L40 28 Z"
                    fill={MUSTARD}
                    className="a-arrowhead"
                  />
                </svg>
                <svg
                  viewBox="0 0 40 60"
                  className="w-10 sm:hidden"
                  aria-hidden
                >
                  <line
                    x1="20"
                    y1="2"
                    x2="20"
                    y2="46"
                    stroke={MUSTARD}
                    strokeWidth="4"
                    strokeDasharray="64"
                    className="a-draw"
                  />
                  <path
                    d="M12 40 L20 54 L28 40 Z"
                    fill={MUSTARD}
                    className="a-arrowhead"
                  />
                </svg>
              </div>

              {/* AFTER — three service circles + a cache square */}
              <div className="flex flex-col items-center">
                <svg
                  viewBox="0 0 240 160"
                  className="w-full max-w-[240px]"
                  aria-hidden
                >
                  <line x1="120" y1="20" x2="40" y2="92" stroke={BONE_35} strokeWidth="2" />
                  <line x1="120" y1="20" x2="120" y2="92" stroke={BONE_35} strokeWidth="2" />
                  <line x1="120" y1="20" x2="200" y2="92" stroke={BONE_35} strokeWidth="2" />
                  <rect
                    x="104"
                    y="6"
                    width="32"
                    height="32"
                    rx="5"
                    fill={TEAL}
                    className="a-pop a-pop-5"
                  />
                  <circle cx="40" cy="116" r="34" fill={MUSTARD} className="a-pop a-pop-2" />
                  <circle cx="120" cy="116" r="34" fill={CORAL} className="a-pop a-pop-3" />
                  <circle cx="200" cy="116" r="34" fill={TEAL} className="a-pop a-pop-4" />
                  <text x="40" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}>read</text>
                  <text x="120" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}>core</text>
                  <text x="200" y="120" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill={BONE}>write</text>
                  <text x="120" y="26" textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700" fill={BONE}>cache</text>
                </svg>
                <span
                  className="mt-auto whitespace-nowrap pt-4 text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ fontFamily: MONO, color: CORAL }}
                >
                  After · 4 nodes · p99 290ms
                </span>
              </div>
            </div>
          </div>

          {/* ── TALL BLOCK: refactor log on a colored field ── */}
          <div
            className="a-card rounded-3xl p-6 sm:col-span-2 sm:row-span-2"
            style={{ backgroundColor: TEAL, color: BONE }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="text-xl font-black uppercase tracking-wider"
                style={{ color: BONE }}
              >
                Refactor log
              </h3>
              <span
                className="a-dot h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: MUSTARD }}
              />
            </div>
            <div className="mt-5 space-y-3" style={{ fontFamily: MONO }}>
              {log.map((line) => (
                <div key={line.t} className="a-log flex gap-2 text-[12px] leading-snug">
                  <span className="shrink-0" style={{ color: BONE }}>
                    [{line.t}]
                  </span>
                  <span style={{ color: BONE_85 }}>
                    {line.body}
                    {line.verdict && (
                      <>
                        {" "}
                        <span className="font-bold" style={{ color: MUSTARD }}>
                          {line.verdict}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-6 border-t pt-4 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ borderColor: BONE_25, fontFamily: MONO, color: BONE_85 }}
            >
              auto · canary · proven · rollback armed
            </div>
          </div>

          {/* ── STAT TILES: flat-color blocks with big numerals ── */}
          {stats.map((s) => (
            <div
              key={s.label}
              className={`a-card flex flex-row items-center justify-between gap-4 rounded-3xl p-6 sm:col-span-2 sm:min-h-[168px] sm:flex-col sm:items-start sm:gap-6 ${s.border ? "border-2" : ""}`}
              style={{
                backgroundColor: s.bg,
                color: s.fg,
                borderColor: s.border ? INK : undefined,
              }}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: s.labelFg ?? s.fg }}
                >
                  {s.label}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: MONO, color: s.labelFg ?? INK_90, opacity: 0.7 }}
                >
                  {s.sub}
                </span>
              </div>
              <span className="a-num text-5xl font-black leading-none sm:text-6xl">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* A wide modernist statement bar — circles + bold type */}
        <div
          className="a-statement mt-4 flex flex-wrap items-center gap-6 rounded-3xl px-7 py-8"
          style={{ backgroundColor: INK, color: BONE }}
        >
          <svg viewBox="0 0 120 40" className="h-10 w-32 shrink-0" aria-hidden>
            <circle cx="20" cy="20" r="16" fill={CORAL} className="a-sdot" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle cx="52" cy="20" r="12" fill={MUSTARD} className="a-sdot" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle cx="80" cy="20" r="9" fill={TEAL} className="a-sdot" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle cx="104" cy="20" r="6" fill={TEAL} className="a-sdot" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          </svg>
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">
            Aalto reshapes the topology while production keeps serving.
          </p>
        </div>
      </main>

      {/* ════════════════════ CLOSING CTA BAND ════════════════════ */}
      <section
        className="relative mt-4 overflow-hidden"
        style={{ backgroundColor: INK, color: BONE }}
        aria-labelledby="cta-heading"
      >
        {/* left: a large coral half-circle bleeding off the edge */}
        <svg
          className="pointer-events-none absolute -left-24 top-1/2 hidden h-72 w-72 -translate-y-1/2 sm:block"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle cx="100" cy="100" r="100" fill={CORAL} />
        </svg>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20 sm:pl-40">
          <h2
            id="cta-heading"
            className="max-w-md text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl"
          >
            Let the architecture bend.
          </h2>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <Link
              href="/signup"
              className="a-pill a-cta-coral inline-flex min-h-[52px] items-center rounded-full px-7 text-base font-bold leading-none"
              style={{ backgroundColor: CORAL, color: INK }}
            >
              Get started
            </Link>
            <Link
              href="/experiments"
              className="inline-flex min-h-[44px] items-center text-[12px] font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO, color: BONE_85 }}
            >
              Watch a refactor &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ WAVE-MOTIF FOOTER ════════════════════ */}
      <footer className="relative">
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
            vectorEffect="non-scaling-stroke"
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
                style={{ fontFamily: MONO, color: INK_90 }}
              >
                Aalto · Helsinki · aalto.fi
              </div>
            </div>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="a-pill inline-flex min-h-[44px] items-center rounded-full px-5 text-[11px] font-bold uppercase tracking-[0.3em]"
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
