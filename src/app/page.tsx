import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { ArrowRight, Beaker, BarChart3, BookOpen, Library } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              {appConfig.name.charAt(0)}
            </div>
            <span className="font-semibold text-lg">{appConfig.name}</span>
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
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Scientific experimentation platform
        </p>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          The art of doing science and engineering
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Design experiments with statistical rigor. Run them with discipline.
          Build institutional knowledge that compounds. Every decision backed by evidence.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/signup">
            <Button size="lg">
              Start experimenting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Experiment with rigor</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A complete system for teams that treat product decisions as scientific hypotheses.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Beaker className="h-6 w-6" />,
                title: "Experiment Design Wizard",
                desc: "Guided workflow from hypothesis to launch. Define metrics, configure variants, calculate sample sizes. No shortcuts, no guesswork.",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Statistical Rigor",
                desc: "Built-in sample size calculators, p-value tracking, confidence intervals. Color-coded significance so you see the signal, not the noise.",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Methodology Playbook",
                desc: "Protocols for A/B testing, multivariate, before/after, surveys, and qualitative research. Best practices and pitfalls documented.",
              },
              {
                icon: <Library className="h-6 w-6" />,
                title: "Institutional Learning",
                desc: "Every experiment concludes with a decision and captured learnings. Searchable archive that turns past experiments into future advantage.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-background p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How it works</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Hypothesize",
              desc: "State your hypothesis. Define what you expect to change, by how much, and why. Pre-register before you run.",
            },
            {
              step: "02",
              title: "Measure",
              desc: "Run the experiment until you reach statistical power. No peeking. No early stopping. Let the data accumulate.",
            },
            {
              step: "03",
              title: "Decide",
              desc: "Ship, iterate, or discard. Capture learnings. Add to the institutional memory. Inform the next experiment.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <span className="text-4xl font-bold text-muted-foreground/30">{item.step}</span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold">Stop guessing. Start measuring.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Build a culture of evidence-driven decisions.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
