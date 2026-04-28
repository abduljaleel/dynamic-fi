import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import {
  ArrowRight,
  Beaker,
  BarChart3,
  BookOpen,
  Library,
  FlaskConical,
  Target,
  TrendingUp,
  Ruler,
  Microscope,
  RefreshCw,
  Search,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b border-teal-200/40 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold font-mono">
              {appConfig.name.charAt(0)}
            </div>
            <span className="font-semibold text-lg tracking-tight">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-700 mb-6">
          <FlaskConical className="h-3.5 w-3.5" />
          Scientific experimentation platform
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl text-gray-900">
          The art of doing{" "}
          <span className="text-teal-600">science</span>{" "}
          and engineering
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Hypothesis first. Measurement always. Experiment with rigor.
          Design experiments with statistical discipline. Build institutional knowledge that compounds.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
              Start experimenting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-teal-200 text-teal-800 hover:bg-teal-50">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Experiment Design Preview */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="rounded-xl border border-teal-200/50 bg-white p-6 md:p-8 font-mono text-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Experiment #247 &mdash; Active</span>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Hypothesis</p>
              <p className="text-sm font-sans text-gray-700 leading-relaxed">
                Reducing onboarding steps from 5 to 3 will increase completion rate by 15%.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Primary Metric</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">+18.3%</span>
                <span className="text-xs text-teal-600 font-sans">p=0.003</span>
              </div>
              <p className="text-xs text-gray-500 font-sans">Onboarding completion rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Variants</p>
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-600">Control (5 steps)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <span className="text-xs text-gray-600">Treatment (3 steps)</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Sample Size</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">4,218</span>
                <span className="text-xs text-gray-500 font-sans">/ 4,000 target</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-teal-200/30 bg-gradient-to-b from-teal-50/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Experiment with rigor</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A complete system for teams that treat product decisions as scientific hypotheses.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Beaker className="h-5 w-5" />,
                title: "Experiment Wizard",
                desc: "Guided workflow from hypothesis to launch. Define metrics, configure variants, calculate sample sizes.",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: "Statistical Analysis",
                desc: "Built-in p-value tracking, confidence intervals, and significance testing. See the signal, not the noise.",
              },
              {
                icon: <Ruler className="h-5 w-5" />,
                title: "Sample Size Calculator",
                desc: "Calculate required sample sizes for any effect size and confidence level. No more underpowered experiments.",
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "Methodology Playbook",
                desc: "Protocols for A/B testing, multivariate, before/after, surveys, and qualitative research.",
              },
              {
                icon: <Library className="h-5 w-5" />,
                title: "Experiment Library",
                desc: "Searchable archive of past experiments. Every result becomes institutional knowledge.",
              },
              {
                icon: <Microscope className="h-5 w-5" />,
                title: "Peer Review",
                desc: "Built-in review workflows. Get experiment designs validated before committing resources.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg border border-teal-200/40 bg-white p-5 hover:shadow-md hover:shadow-teal-100/50 transition-all duration-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-600 border border-teal-200/50">
                  {feature.icon}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-teal-200/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold text-gray-900">How it works</h2>
          <p className="text-center text-muted-foreground mt-3 max-w-xl mx-auto">
            The scientific method, productized. Four stages from question to knowledge.
          </p>
          <div className="mt-16 grid gap-0 md:grid-cols-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-teal-200" />
            {[
              {
                icon: <Target className="h-5 w-5" />,
                step: "01",
                title: "Design",
                desc: "State your hypothesis. Define metrics, variants, and sample size. Pre-register before you run.",
              },
              {
                icon: <FlaskConical className="h-5 w-5" />,
                step: "02",
                title: "Run",
                desc: "Execute the experiment with discipline. No peeking. No early stopping. Let the data accumulate.",
              },
              {
                icon: <Search className="h-5 w-5" />,
                step: "03",
                title: "Analyze",
                desc: "Statistical analysis with guardrails. Confidence intervals, effect sizes, and practical significance.",
              },
              {
                icon: <RefreshCw className="h-5 w-5" />,
                step: "04",
                title: "Learn",
                desc: "Ship, iterate, or discard. Capture learnings. Add to institutional memory. Inform the next experiment.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center px-4 relative z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-600 border-2 border-teal-200">
                  {item.icon}
                </div>
                <span className="block mt-3 text-xs font-mono text-teal-500 font-semibold">{item.step}</span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-teal-200/30 bg-gradient-to-b from-teal-50/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              { value: "847", label: "experiments designed" },
              { value: "92%", label: "reach statistical significance" },
              { value: "3.2x", label: "faster iteration" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold font-mono text-teal-600">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-teal-200/30">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Stop guessing. Start measuring.</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Build a culture of evidence-driven decisions. Every experiment makes your team smarter.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-200/30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
