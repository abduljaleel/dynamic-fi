"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Beaker, BarChart3, GitBranch, ClipboardList, MessageSquare } from "lucide-react";

interface PlaybookEntry {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: string[];
  bestPractices: string[];
  pitfalls: string[];
}

const playbook: PlaybookEntry[] = [
  {
    id: "ab-testing",
    title: "A/B Testing Protocol",
    icon: <Beaker className="h-5 w-5" />,
    description:
      "The gold standard for causal inference in product experimentation. Split traffic between control and treatment groups to measure the impact of a single change.",
    steps: [
      "Define a specific, falsifiable hypothesis with a measurable outcome.",
      "Select a primary metric and set guardrail metrics that must not degrade.",
      "Calculate the required sample size using baseline rate, MDE, and significance level.",
      "Implement randomized assignment with consistent user bucketing.",
      "Run until the predetermined sample size is reached. Do not peek at results early.",
      "Analyze using a two-tailed t-test or chi-square test at the pre-specified alpha.",
      "Document the decision (ship/iterate/discard) and key learnings.",
    ],
    bestPractices: [
      "Pre-register your hypothesis and analysis plan before starting.",
      "Use a single primary metric to avoid multiple comparison problems.",
      "Ensure 1:1 allocation unless there is a strong reason to deviate.",
      "Run an A/A test first to validate your instrumentation.",
      "Account for novelty effects by running long enough (minimum 1 business cycle).",
    ],
    pitfalls: [
      "Peeking at results and stopping early inflates false positive rates.",
      "Running multiple tests on overlapping populations without correction.",
      "Confusing statistical significance with practical significance.",
      "Ignoring sample ratio mismatch (SRM) checks.",
      "Not accounting for network effects or spillover between groups.",
    ],
  },
  {
    id: "before-after",
    title: "Before/After Analysis",
    icon: <BarChart3 className="h-5 w-5" />,
    description:
      "Compare metrics before and after a change when A/B testing is not feasible. Useful for infrastructure changes, pricing updates, or policy modifications that affect all users.",
    steps: [
      "Establish a stable baseline period (minimum 2-4 weeks of data).",
      "Document all confounding factors and seasonal patterns.",
      "Implement the change with a clear cutoff timestamp.",
      "Allow a ramp-up period before measuring (users need to encounter the change).",
      "Compare metrics using interrupted time series analysis or difference-in-differences.",
      "Control for external factors (seasonality, marketing campaigns, market events).",
      "Report effect sizes with appropriate uncertainty bounds.",
    ],
    bestPractices: [
      "Use a comparison group (different segment, region) as a synthetic control.",
      "Choose baseline and measurement windows of equal length.",
      "Measure multiple metrics to build a coherent narrative.",
      "Document every other change that happened in the same period.",
      "Use regression to control for known confounders.",
    ],
    pitfalls: [
      "Attributing all changes to your intervention (omitted variable bias).",
      "Choosing a baseline period that is not representative.",
      "Not accounting for mean reversion or trends.",
      "Ignoring the maturation effect (would the metric have changed anyway?).",
      "Reporting results without uncertainty intervals.",
    ],
  },
  {
    id: "multivariate",
    title: "Multivariate Testing",
    icon: <GitBranch className="h-5 w-5" />,
    description:
      "Test multiple variables simultaneously to find the best combination. Use when you need to optimize several elements at once and want to understand interaction effects.",
    steps: [
      "Identify the independent variables and their levels (e.g., headline x 3, CTA x 2).",
      "Determine if you need a full factorial or fractional factorial design.",
      "Calculate sample size per cell (significantly larger than simple A/B tests).",
      "Implement random assignment across all combinations.",
      "Analyze main effects and interaction effects using ANOVA or regression.",
      "Identify the winning combination and validate with a follow-up A/B test.",
      "Document interaction effects for future experiment design.",
    ],
    bestPractices: [
      "Limit to 2-3 variables with 2-3 levels each to keep sample sizes manageable.",
      "Use fractional factorial designs when full factorial requires too much traffic.",
      "Focus on variables likely to have interaction effects.",
      "Run a power analysis for the smallest cell before starting.",
      "Consider Bayesian methods for faster convergence with many variants.",
    ],
    pitfalls: [
      "Testing too many combinations with insufficient traffic.",
      "Ignoring interaction effects and only looking at main effects.",
      "Not correcting for multiple comparisons.",
      "Running without enough power in the smallest cell.",
      "Overinterpreting results from low-traffic combinations.",
    ],
  },
  {
    id: "survey-design",
    title: "Survey Design",
    icon: <ClipboardList className="h-5 w-5" />,
    description:
      "Structured data collection from users to understand preferences, satisfaction, and behavior drivers. Complements quantitative experiments with attitudinal data.",
    steps: [
      "Define the research question and what decisions the survey will inform.",
      "Choose the target population and sampling strategy.",
      "Write questions: start broad, move to specific, sensitive questions last.",
      "Use validated scales where available (NPS, SUS, CSAT).",
      "Pilot test with 5-10 people and iterate on confusing questions.",
      "Deploy with a target response rate and timeline.",
      "Analyze with appropriate statistical methods (descriptive, regression, factor analysis).",
    ],
    bestPractices: [
      "Keep surveys under 5 minutes to maximize completion rates.",
      "Use a mix of closed-ended (quantitative) and open-ended (qualitative) questions.",
      "Randomize option order to reduce order bias.",
      "Include attention check questions to filter low-quality responses.",
      "Offer incentives proportional to survey length.",
    ],
    pitfalls: [
      "Leading questions that suggest a desired answer.",
      "Double-barreled questions that ask about two things at once.",
      "Selection bias from self-selected respondents.",
      "Acquiescence bias (tendency to agree with statements).",
      "Not piloting the survey before full deployment.",
    ],
  },
  {
    id: "qualitative",
    title: "Qualitative Research",
    icon: <MessageSquare className="h-5 w-5" />,
    description:
      "In-depth exploration of user behavior, motivations, and pain points through interviews, usability tests, and observation. Essential for hypothesis generation and understanding the 'why'.",
    steps: [
      "Define research objectives: what do you need to understand and why?",
      "Choose the method: interviews, usability testing, diary studies, contextual inquiry.",
      "Create a discussion guide or test protocol.",
      "Recruit 5-8 participants per segment (saturation typically occurs at 5-7).",
      "Conduct sessions with a facilitator and a note-taker.",
      "Synthesize findings using affinity mapping or thematic analysis.",
      "Generate hypotheses that can be validated with quantitative experiments.",
    ],
    bestPractices: [
      "Ask open-ended questions. Avoid yes/no questions.",
      "Follow the participant's lead and probe deeper on unexpected insights.",
      "Record sessions (with permission) for accurate synthesis.",
      "Debrief after each session while details are fresh.",
      "Triangulate findings with behavioral data.",
    ],
    pitfalls: [
      "Asking users what they would do instead of observing what they actually do.",
      "Confirmation bias: only hearing what validates your assumptions.",
      "Too few participants to identify patterns.",
      "Not segmenting participants by relevant characteristics.",
      "Treating qualitative findings as statistically representative.",
    ],
  },
];

export default function PlaybookPage() {
  const [expandedId, setExpandedId] = useState<string | null>("ab-testing");

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playbook</h1>
        <p className="text-muted-foreground">
          Methodology templates and protocols for rigorous experimentation.
        </p>
      </div>

      <div className="space-y-3">
        {playbook.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <Card key={entry.id}>
              <button
                className="w-full text-left"
                onClick={() => toggle(entry.id)}
              >
                <CardHeader className="flex flex-row items-center gap-3 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{entry.title}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs">
                      {entry.description}
                    </CardDescription>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </CardHeader>
              </button>
              {isExpanded && (
                <CardContent className="pt-0 space-y-6">
                  <p className="text-sm text-muted-foreground">{entry.description}</p>

                  <div>
                    <h3 className="text-sm font-semibold mb-3">Steps</h3>
                    <ol className="space-y-2">
                      {entry.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
                      <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                        Best Practices
                      </h4>
                      <ul className="space-y-1.5">
                        {entry.bestPractices.map((bp, i) => (
                          <li key={i} className="text-xs text-emerald-800 dark:text-emerald-200 flex gap-2">
                            <span className="shrink-0 mt-0.5">+</span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                      <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                        Common Pitfalls
                      </h4>
                      <ul className="space-y-1.5">
                        {entry.pitfalls.map((p, i) => (
                          <li key={i} className="text-xs text-red-800 dark:text-red-200 flex gap-2">
                            <span className="shrink-0 mt-0.5">-</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
