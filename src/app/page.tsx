import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "#fafafa",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Nav */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-teal-600 text-white text-xs font-mono font-bold">
              D
            </div>
            <span className="font-mono font-bold text-gray-900 tracking-tight">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-teal-600 transition-colors font-mono">
              sign in
            </Link>
            <Link href="/signup" className="text-sm bg-teal-600 text-white px-4 py-1.5 rounded font-mono hover:bg-teal-700 transition-colors">
              get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20">
        <div className="max-w-3xl">
          <p className="font-mono text-sm text-gray-400 mb-4 tracking-wide">
            hypothesis &rarr; experiment &rarr; evidence &rarr; truth
          </p>
          <h1 className="text-5xl md:text-6xl font-mono font-bold text-gray-900 tracking-tight leading-[1.1]">
            Dynamic
          </h1>
          <p className="mt-4 text-xl text-gray-600 font-mono leading-relaxed">
            The scientific method for product teams.
          </p>
          <div className="mt-8 flex gap-4 items-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded font-mono text-sm hover:bg-teal-700 transition-colors">
              Design your first experiment
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/login" className="text-sm font-mono text-gray-500 hover:text-teal-600 transition-colors underline underline-offset-4 decoration-gray-300">
              or sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Live Experiment Card */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="max-w-2xl">
          <div
            className="rounded-none border-2 border-gray-300 bg-white p-6 md:p-8 font-mono text-sm"
            style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.06)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-900 font-bold tracking-wider text-xs">EXPERIMENT #847</span>
              <span className="text-[10px] text-gray-400">dynamic.fi/exp/847</span>
            </div>
            <div className="text-gray-300 text-xs leading-none select-none mb-4">
              ─────────────────────────────────────────
            </div>

            {/* Hypothesis */}
            <div className="mb-4">
              <span className="text-gray-500 text-xs">Hypothesis:</span>
              <p className="text-gray-800 mt-1 leading-relaxed">
                Reducing checkout steps from 4 to 2<br />
                will increase conversion by 15%
              </p>
            </div>

            {/* Status */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-gray-500 text-xs">Status:</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-600 text-xs font-bold">RUNNING</span>
                <span className="text-gray-400 text-xs">(Day 12 of 21)</span>
              </span>
            </div>

            {/* Variants */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-xs shrink-0 w-28">Variant A (Control):</span>
                <span className="text-gray-700 text-xs">3.2% conversion</span>
                <span className="text-gray-400 text-xs">(n=4,521)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-xs shrink-0 w-28">Variant B (Treatment):</span>
                <span className="text-gray-700 text-xs">3.8% conversion</span>
                <span className="text-gray-400 text-xs">(n=4,498)</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs">
              <span className="text-gray-700">Lift: <span className="text-teal-600 font-bold">+18.7%</span></span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">p-value: <span className="text-teal-600 font-bold">0.003</span></span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">Power: <span className="text-teal-600 font-bold">94%</span></span>
            </div>

            {/* Divider */}
            <div className="text-gray-300 text-xs leading-none select-none mb-3">
              ─────────────────────────────────────────
            </div>

            {/* Significance */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#0d9488" opacity="0.1" stroke="#0d9488" strokeWidth="1"/>
                <path d="M5 8l2 2 4-4" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-teal-700 font-bold text-xs tracking-wider">STATISTICALLY SIGNIFICANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Size Calculator */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-6">Sample Size Calculator</p>
        <div className="max-w-2xl">
          <div
            className="rounded-none border-2 border-gray-300 bg-white p-6 md:p-8"
            style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.06)" }}
          >
            {/* Formula */}
            <div className="text-center mb-6">
              <p className="font-mono text-gray-400 text-xs mb-3 uppercase tracking-wider">Formula</p>
              <div className="inline-block text-center">
                <span className="font-mono text-lg text-gray-800">
                  n = (Z<sub className="text-xs text-teal-600">&alpha;</sub> + Z<sub className="text-xs text-teal-600">&beta;</sub>)<sup className="text-xs">2</sup>
                  {" "}&times;{" "}
                  &sigma;<sup className="text-xs">2</sup>
                  {" "}/{" "}
                  &delta;<sup className="text-xs">2</sup>
                </span>
              </div>
            </div>

            <div className="text-gray-300 text-xs leading-none select-none mb-6 font-mono text-center">
              ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
            </div>

            {/* Input / Output */}
            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="text-center">
                <p className="text-gray-400 mb-1">Baseline</p>
                <p className="text-xl font-bold text-gray-800">3.2%</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-1">MDE</p>
                <p className="text-xl font-bold text-gray-800">15%</p>
                <span className="text-gray-400 text-[10px]">min. detectable effect</span>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-1">Required</p>
                <p className="text-xl font-bold text-teal-600">8,400</p>
                <span className="text-gray-400 text-[10px]">samples per variant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Cycle */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-6 text-center">The Experimentation Cycle</p>
        <div className="flex justify-center">
          <div className="relative" style={{ width: 280, height: 280 }}>
            {/* Circle path */}
            <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full">
              {/* Background circle */}
              <circle cx="140" cy="140" r="100" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4"/>
              {/* Arrow arcs */}
              <path d="M 140 40 A 100 100 0 0 1 230 105" fill="none" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 230 175 A 100 100 0 0 1 140 240" fill="none" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 100 230 A 100 100 0 0 1 50 140" fill="none" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M 55 100 A 100 100 0 0 1 120 42" fill="none" stroke="#0d9488" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#0d9488"/>
                </marker>
              </defs>
            </svg>
            {/* Labels */}
            <div className="absolute font-mono text-xs font-bold" style={{ top: 16, left: "50%", transform: "translateX(-50%)" }}>
              <span className="bg-teal-600 text-white px-2 py-1 rounded text-[10px] uppercase tracking-wider">Design</span>
            </div>
            <div className="absolute font-mono text-xs font-bold" style={{ top: "50%", right: -4, transform: "translateY(-50%)" }}>
              <span className="bg-teal-600 text-white px-2 py-1 rounded text-[10px] uppercase tracking-wider">Run</span>
            </div>
            <div className="absolute font-mono text-xs font-bold" style={{ bottom: 16, left: "50%", transform: "translateX(-50%)" }}>
              <span className="bg-teal-600 text-white px-2 py-1 rounded text-[10px] uppercase tracking-wider">Analyze</span>
            </div>
            <div className="absolute font-mono text-xs font-bold" style={{ top: "50%", left: -4, transform: "translateY(-50%)" }}>
              <span className="bg-teal-600 text-white px-2 py-1 rounded text-[10px] uppercase tracking-wider">Learn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div
          className="rounded-none border-2 border-gray-300 bg-white p-8"
          style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.06)" }}
        >
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Lab Report Summary</p>
          <div className="grid grid-cols-3 gap-6 text-center font-mono">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">847</p>
              <p className="text-xs text-gray-500 mt-1">experiments</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-teal-600">92%</p>
              <p className="text-xs text-gray-500 mt-1">reach significance</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">3.2x</p>
              <p className="text-xs text-gray-500 mt-1">faster iteration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-sm text-gray-400 mb-4">
            Stop guessing. Start measuring.
          </p>
          <h2 className="text-3xl font-mono font-bold text-gray-900 mb-4">
            Every experiment makes your team smarter.
          </h2>
          <p className="text-gray-500 font-mono text-sm mb-8">
            Build a culture of evidence. Ship with confidence.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded font-mono text-sm hover:bg-teal-700 transition-colors">
            Design your first experiment
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-14 max-w-5xl items-center justify-between px-4 py-3 sm:py-0 gap-2 font-mono text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
