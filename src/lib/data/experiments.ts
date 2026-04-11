export type ExperimentStatus = "design" | "running" | "analyzing" | "concluded";
export type ExperimentType = "a/b-test" | "multivariate" | "before-after";
export type ExperimentOutcome = "shipped" | "iterated" | "discarded" | null;
export type MetricDirection = "increase" | "decrease";

export interface Metric {
  name: string;
  direction: MetricDirection;
  minimumDetectableEffect: number; // percentage
}

export interface Variant {
  id: string;
  name: string;
  allocation: number; // percentage
  sampleSize: number;
  metrics: VariantMetric[];
}

export interface VariantMetric {
  name: string;
  value: number;
  confidenceInterval: [number, number];
  pValue: number;
  significant: boolean;
  direction: "positive" | "negative" | "neutral";
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  type: ExperimentType;
  status: ExperimentStatus;
  outcome: ExperimentOutcome;
  primaryMetric: Metric;
  guardrailMetrics: Metric[];
  variants: Variant[];
  startDate: string;
  endDate: string | null;
  totalSampleSize: number;
  requiredSampleSize: number;
  significanceLevel: number;
  baselineRate: number;
  keyLearning: string | null;
  conclusion: string | null;
  decision: "ship" | "iterate" | "discard" | null;
  createdBy: string;
}

export const experiments: Experiment[] = [
  {
    id: "exp-001",
    name: "Checkout Flow Simplification",
    hypothesis: "Reducing the checkout process from 4 steps to 2 steps will increase conversion rate by at least 5%.",
    type: "a/b-test",
    status: "running",
    outcome: null,
    primaryMetric: {
      name: "Checkout Conversion Rate",
      direction: "increase",
      minimumDetectableEffect: 5,
    },
    guardrailMetrics: [
      { name: "Average Order Value", direction: "increase", minimumDetectableEffect: 2 },
      { name: "Return Rate", direction: "decrease", minimumDetectableEffect: 1 },
    ],
    variants: [
      {
        id: "v-001a",
        name: "Control (4-step)",
        allocation: 50,
        sampleSize: 12430,
        metrics: [
          { name: "Checkout Conversion Rate", value: 3.2, confidenceInterval: [2.9, 3.5], pValue: 1, significant: false, direction: "neutral" },
          { name: "Average Order Value", value: 84.5, confidenceInterval: [82.1, 86.9], pValue: 1, significant: false, direction: "neutral" },
          { name: "Return Rate", value: 4.1, confidenceInterval: [3.7, 4.5], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-001b",
        name: "Treatment (2-step)",
        allocation: 50,
        sampleSize: 12385,
        metrics: [
          { name: "Checkout Conversion Rate", value: 3.8, confidenceInterval: [3.5, 4.1], pValue: 0.003, significant: true, direction: "positive" },
          { name: "Average Order Value", value: 83.9, confidenceInterval: [81.5, 86.3], pValue: 0.62, significant: false, direction: "neutral" },
          { name: "Return Rate", value: 4.3, confidenceInterval: [3.9, 4.7], pValue: 0.41, significant: false, direction: "neutral" },
        ],
      },
    ],
    startDate: "2026-03-15",
    endDate: null,
    totalSampleSize: 24815,
    requiredSampleSize: 30000,
    significanceLevel: 0.05,
    baselineRate: 3.2,
    keyLearning: null,
    conclusion: null,
    decision: null,
    createdBy: "Sarah Chen",
  },
  {
    id: "exp-002",
    name: "Personalized Recommendations Engine",
    hypothesis: "ML-driven product recommendations will increase average session revenue by at least 8% compared to rule-based recommendations.",
    type: "a/b-test",
    status: "concluded",
    outcome: "shipped",
    primaryMetric: {
      name: "Average Session Revenue",
      direction: "increase",
      minimumDetectableEffect: 8,
    },
    guardrailMetrics: [
      { name: "Page Load Time", direction: "decrease", minimumDetectableEffect: 5 },
      { name: "Bounce Rate", direction: "decrease", minimumDetectableEffect: 2 },
    ],
    variants: [
      {
        id: "v-002a",
        name: "Control (Rule-based)",
        allocation: 50,
        sampleSize: 45200,
        metrics: [
          { name: "Average Session Revenue", value: 12.40, confidenceInterval: [11.80, 13.00], pValue: 1, significant: false, direction: "neutral" },
          { name: "Page Load Time", value: 1.2, confidenceInterval: [1.1, 1.3], pValue: 1, significant: false, direction: "neutral" },
          { name: "Bounce Rate", value: 34.5, confidenceInterval: [33.2, 35.8], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-002b",
        name: "Treatment (ML-driven)",
        allocation: 50,
        sampleSize: 45150,
        metrics: [
          { name: "Average Session Revenue", value: 14.10, confidenceInterval: [13.50, 14.70], pValue: 0.0001, significant: true, direction: "positive" },
          { name: "Page Load Time", value: 1.3, confidenceInterval: [1.2, 1.4], pValue: 0.08, significant: false, direction: "neutral" },
          { name: "Bounce Rate", value: 33.1, confidenceInterval: [31.8, 34.4], pValue: 0.04, significant: true, direction: "positive" },
        ],
      },
    ],
    startDate: "2026-01-10",
    endDate: "2026-02-28",
    totalSampleSize: 90350,
    requiredSampleSize: 80000,
    significanceLevel: 0.05,
    baselineRate: 12.4,
    keyLearning: "ML recommendations drove 13.7% increase in session revenue with no meaningful degradation in page performance. The model performed particularly well for returning users.",
    conclusion: "Ship to 100% of traffic. ML recommendations significantly outperformed rule-based system across primary and guardrail metrics.",
    decision: "ship",
    createdBy: "Marcus Johnson",
  },
  {
    id: "exp-003",
    name: "Pricing Page Layout Multivariate",
    hypothesis: "Testing combinations of pricing card layout (horizontal vs vertical) and CTA copy (Start Free vs Try Now) will identify a combination that increases plan selection rate by 3%.",
    type: "multivariate",
    status: "analyzing",
    outcome: null,
    primaryMetric: {
      name: "Plan Selection Rate",
      direction: "increase",
      minimumDetectableEffect: 3,
    },
    guardrailMetrics: [
      { name: "Time on Page", direction: "increase", minimumDetectableEffect: 5 },
    ],
    variants: [
      {
        id: "v-003a",
        name: "Vertical + Start Free",
        allocation: 25,
        sampleSize: 8200,
        metrics: [
          { name: "Plan Selection Rate", value: 12.1, confidenceInterval: [11.2, 13.0], pValue: 1, significant: false, direction: "neutral" },
          { name: "Time on Page", value: 45.2, confidenceInterval: [42.1, 48.3], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-003b",
        name: "Vertical + Try Now",
        allocation: 25,
        sampleSize: 8150,
        metrics: [
          { name: "Plan Selection Rate", value: 11.8, confidenceInterval: [10.9, 12.7], pValue: 0.55, significant: false, direction: "neutral" },
          { name: "Time on Page", value: 43.8, confidenceInterval: [40.7, 46.9], pValue: 0.32, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-003c",
        name: "Horizontal + Start Free",
        allocation: 25,
        sampleSize: 8180,
        metrics: [
          { name: "Plan Selection Rate", value: 14.3, confidenceInterval: [13.3, 15.3], pValue: 0.001, significant: true, direction: "positive" },
          { name: "Time on Page", value: 38.5, confidenceInterval: [35.6, 41.4], pValue: 0.002, significant: true, direction: "negative" },
        ],
      },
      {
        id: "v-003d",
        name: "Horizontal + Try Now",
        allocation: 25,
        sampleSize: 8190,
        metrics: [
          { name: "Plan Selection Rate", value: 13.9, confidenceInterval: [12.9, 14.9], pValue: 0.004, significant: true, direction: "positive" },
          { name: "Time on Page", value: 39.1, confidenceInterval: [36.2, 42.0], pValue: 0.004, significant: true, direction: "negative" },
        ],
      },
    ],
    startDate: "2026-03-01",
    endDate: "2026-04-05",
    totalSampleSize: 32720,
    requiredSampleSize: 32000,
    significanceLevel: 0.05,
    baselineRate: 12.1,
    keyLearning: null,
    conclusion: null,
    decision: null,
    createdBy: "Elena Rodriguez",
  },
  {
    id: "exp-004",
    name: "Onboarding Email Sequence",
    hypothesis: "A behavior-triggered email sequence will increase 7-day activation rate by at least 10% compared to the fixed-schedule sequence.",
    type: "a/b-test",
    status: "concluded",
    outcome: "iterated",
    primaryMetric: {
      name: "7-Day Activation Rate",
      direction: "increase",
      minimumDetectableEffect: 10,
    },
    guardrailMetrics: [
      { name: "Unsubscribe Rate", direction: "decrease", minimumDetectableEffect: 1 },
      { name: "Spam Report Rate", direction: "decrease", minimumDetectableEffect: 0.5 },
    ],
    variants: [
      {
        id: "v-004a",
        name: "Control (Fixed Schedule)",
        allocation: 50,
        sampleSize: 5200,
        metrics: [
          { name: "7-Day Activation Rate", value: 23.4, confidenceInterval: [21.8, 25.0], pValue: 1, significant: false, direction: "neutral" },
          { name: "Unsubscribe Rate", value: 2.1, confidenceInterval: [1.7, 2.5], pValue: 1, significant: false, direction: "neutral" },
          { name: "Spam Report Rate", value: 0.3, confidenceInterval: [0.1, 0.5], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-004b",
        name: "Treatment (Behavior-triggered)",
        allocation: 50,
        sampleSize: 5180,
        metrics: [
          { name: "7-Day Activation Rate", value: 26.1, confidenceInterval: [24.5, 27.7], pValue: 0.02, significant: true, direction: "positive" },
          { name: "Unsubscribe Rate", value: 1.8, confidenceInterval: [1.4, 2.2], pValue: 0.12, significant: false, direction: "neutral" },
          { name: "Spam Report Rate", value: 0.4, confidenceInterval: [0.2, 0.6], pValue: 0.31, significant: false, direction: "neutral" },
        ],
      },
    ],
    startDate: "2026-02-01",
    endDate: "2026-03-15",
    totalSampleSize: 10380,
    requiredSampleSize: 10000,
    significanceLevel: 0.05,
    baselineRate: 23.4,
    keyLearning: "Behavior-triggered emails showed a statistically significant 11.5% relative improvement in activation. However, the effect was concentrated in the first 3 days. Need to iterate on days 4-7 triggers.",
    conclusion: "Iterate. The behavior-triggered approach works but needs refinement in the mid-sequence triggers. Ship the first 3 emails, redesign days 4-7.",
    decision: "iterate",
    createdBy: "David Park",
  },
  {
    id: "exp-005",
    name: "Dark Mode Impact on Session Duration",
    hypothesis: "Offering a dark mode option will increase average session duration by 15% for users who enable it.",
    type: "before-after",
    status: "concluded",
    outcome: "discarded",
    primaryMetric: {
      name: "Average Session Duration",
      direction: "increase",
      minimumDetectableEffect: 15,
    },
    guardrailMetrics: [
      { name: "Feature Adoption Rate", direction: "increase", minimumDetectableEffect: 5 },
    ],
    variants: [
      {
        id: "v-005a",
        name: "Before (Light only)",
        allocation: 100,
        sampleSize: 15000,
        metrics: [
          { name: "Average Session Duration", value: 340, confidenceInterval: [325, 355], pValue: 1, significant: false, direction: "neutral" },
          { name: "Feature Adoption Rate", value: 0, confidenceInterval: [0, 0], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-005b",
        name: "After (Dark mode available)",
        allocation: 100,
        sampleSize: 15200,
        metrics: [
          { name: "Average Session Duration", value: 348, confidenceInterval: [333, 363], pValue: 0.38, significant: false, direction: "neutral" },
          { name: "Feature Adoption Rate", value: 18.5, confidenceInterval: [17.2, 19.8], pValue: 0.001, significant: true, direction: "positive" },
        ],
      },
    ],
    startDate: "2025-12-01",
    endDate: "2026-01-31",
    totalSampleSize: 30200,
    requiredSampleSize: 28000,
    significanceLevel: 0.05,
    baselineRate: 340,
    keyLearning: "Dark mode had high adoption (18.5%) but no statistically significant impact on session duration. Users appreciated the option but it did not change engagement behavior. Consider as a quality-of-life feature rather than a growth lever.",
    conclusion: "Discard as a growth experiment. Dark mode does not drive engagement. May still ship as a user preference feature outside the experimentation framework.",
    decision: "discard",
    createdBy: "Lisa Wang",
  },
  {
    id: "exp-006",
    name: "Search Autocomplete Enhancement",
    hypothesis: "Adding ML-powered autocomplete suggestions to the search bar will increase search-to-purchase conversion by 7%.",
    type: "a/b-test",
    status: "design",
    outcome: null,
    primaryMetric: {
      name: "Search-to-Purchase Conversion",
      direction: "increase",
      minimumDetectableEffect: 7,
    },
    guardrailMetrics: [
      { name: "Search Latency (p95)", direction: "decrease", minimumDetectableEffect: 10 },
      { name: "Null Result Rate", direction: "decrease", minimumDetectableEffect: 3 },
    ],
    variants: [
      {
        id: "v-006a",
        name: "Control (Basic search)",
        allocation: 50,
        sampleSize: 0,
        metrics: [],
      },
      {
        id: "v-006b",
        name: "Treatment (ML autocomplete)",
        allocation: 50,
        sampleSize: 0,
        metrics: [],
      },
    ],
    startDate: "2026-04-20",
    endDate: null,
    totalSampleSize: 0,
    requiredSampleSize: 25000,
    significanceLevel: 0.05,
    baselineRate: 8.5,
    keyLearning: null,
    conclusion: null,
    decision: null,
    createdBy: "Sarah Chen",
  },
  {
    id: "exp-007",
    name: "Mobile Navigation Redesign",
    hypothesis: "A bottom navigation bar on mobile will increase pages-per-session by 20% compared to the current hamburger menu.",
    type: "a/b-test",
    status: "running",
    outcome: null,
    primaryMetric: {
      name: "Pages Per Session",
      direction: "increase",
      minimumDetectableEffect: 20,
    },
    guardrailMetrics: [
      { name: "Task Completion Rate", direction: "increase", minimumDetectableEffect: 5 },
    ],
    variants: [
      {
        id: "v-007a",
        name: "Control (Hamburger menu)",
        allocation: 50,
        sampleSize: 6800,
        metrics: [
          { name: "Pages Per Session", value: 3.2, confidenceInterval: [3.0, 3.4], pValue: 1, significant: false, direction: "neutral" },
          { name: "Task Completion Rate", value: 67.3, confidenceInterval: [65.1, 69.5], pValue: 1, significant: false, direction: "neutral" },
        ],
      },
      {
        id: "v-007b",
        name: "Treatment (Bottom nav)",
        allocation: 50,
        sampleSize: 6750,
        metrics: [
          { name: "Pages Per Session", value: 4.1, confidenceInterval: [3.9, 4.3], pValue: 0.0001, significant: true, direction: "positive" },
          { name: "Task Completion Rate", value: 72.8, confidenceInterval: [70.6, 75.0], pValue: 0.001, significant: true, direction: "positive" },
        ],
      },
    ],
    startDate: "2026-03-28",
    endDate: null,
    totalSampleSize: 13550,
    requiredSampleSize: 20000,
    significanceLevel: 0.05,
    baselineRate: 3.2,
    keyLearning: null,
    conclusion: null,
    decision: null,
    createdBy: "Marcus Johnson",
  },
];

export function getExperiment(id: string): Experiment | undefined {
  return experiments.find((e) => e.id === id);
}

export function getExperimentsByStatus(status: ExperimentStatus): Experiment[] {
  return experiments.filter((e) => e.status === status);
}

export function getConcludedExperiments(): Experiment[] {
  return experiments.filter((e) => e.status === "concluded");
}

export function getActiveExperiments(): Experiment[] {
  return experiments.filter((e) => e.status === "running" || e.status === "analyzing");
}

export function getExperimentStats() {
  const total = experiments.length;
  const running = experiments.filter((e) => e.status === "running").length;
  const significant = experiments.filter(
    (e) =>
      e.status === "concluded" &&
      e.variants.some((v) => v.metrics.some((m) => m.significant && m.direction === "positive"))
  ).length;
  const concluded = getConcludedExperiments();
  const avgDuration =
    concluded.length > 0
      ? Math.round(
          concluded.reduce((sum, e) => {
            const start = new Date(e.startDate);
            const end = new Date(e.endDate!);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / concluded.length
        )
      : 0;

  return { total, running, significant, avgDuration };
}
