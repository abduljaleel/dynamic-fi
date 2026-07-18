import { createClient } from "@/lib/supabase/client";
import {
  experiments as experimentSeeds,
  type Experiment,
  type ExperimentOutcome,
  type ExperimentStatus,
  type ExperimentType,
  type Metric,
  type MetricDirection,
  type Variant,
  type VariantMetric,
} from "@/lib/data/experiments";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface Ctx {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  orgId: string;
  fullName: string | null;
  email: string | null;
}

export async function getCtx(): Promise<Ctx> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id, full_name, email")
    .eq("id", user.id)
    .single();
  if (error || !profile?.org_id) {
    throw new Error("Could not load your profile");
  }
  return {
    supabase,
    userId: user.id,
    orgId: profile.org_id as string,
    fullName: (profile.full_name as string | null) ?? null,
    email: (profile.email as string | null) ?? null,
  };
}

export async function getProfileInfo(): Promise<{ name: string }> {
  const ctx = await getCtx();
  return { name: ctx.fullName || ctx.email || "there" };
}

// ---------------------------------------------------------------------------
// DB row shapes (snake_case — verified against the live Supabase schema)
// ---------------------------------------------------------------------------

interface VariantRow {
  id: string;
  experiment_id: string;
  name: string;
  description: string | null;
  is_control: boolean | null;
  config: Record<string, unknown> | null;
  allocation_pct: number | null;
  created_at: string | null;
}

interface MetricRow {
  id: string;
  experiment_id: string;
  name: string;
  metric_type: string | null;
  direction: string | null;
  minimum_detectable_effect: number | null;
  current_value: number | null;
  baseline_value: number | null;
  created_at: string | null;
}

interface ResultRow {
  id: string;
  experiment_id: string;
  variant_id: string | null;
  metric_id: string | null;
  observed_value: number | null;
  confidence_interval: [number, number] | null;
  p_value: number | null;
  is_significant: boolean | null;
  sample_size: number | null;
  computed_at: string | null;
}

interface ExperimentRow {
  id: string;
  org_id: string | null;
  name: string;
  hypothesis: string | null;
  status: string | null;
  experiment_type: string | null;
  owner_id: string | null;
  start_date: string | null;
  end_date: string | null;
  sample_size_target: number | null;
  baseline_rate: number | null;
  significance_level: number | null;
  decision: string | null;
  conclusion: string | null;
  key_learning: string | null;
  created_at: string | null;
  variants?: VariantRow[];
  metrics?: MetricRow[];
  results?: ResultRow[];
}

interface TemplateRow {
  id: string;
  org_id: string | null;
  name: string;
  description: string | null;
  experiment_type: string | null;
  default_config: Record<string, unknown> | null;
  checklist: string[] | null;
  is_public: boolean | null;
  created_at: string | null;
}

// ---------------------------------------------------------------------------
// Mapping: snake_case rows → existing camelCase UI types
// ---------------------------------------------------------------------------

function toDateString(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function deriveVariantMetricDirection(
  significant: boolean,
  metricDirection: MetricDirection,
  observed: number,
  reference: number | null
): "positive" | "negative" | "neutral" {
  if (!significant || reference == null || observed === reference) return "neutral";
  const improved =
    metricDirection === "increase" ? observed > reference : observed < reference;
  return improved ? "positive" : "negative";
}

function decisionToOutcome(decision: string | null): ExperimentOutcome {
  if (decision === "ship") return "shipped";
  if (decision === "iterate") return "iterated";
  if (decision === "discard") return "discarded";
  return null;
}

function mapMetric(row: MetricRow): Metric {
  return {
    name: row.name,
    direction: (row.direction as MetricDirection) || "increase",
    minimumDetectableEffect: Number(row.minimum_detectable_effect ?? 0),
  };
}

function mapExperiment(row: ExperimentRow, currentUser: Ctx | null): Experiment {
  const metricRows = [...(row.metrics ?? [])].sort((a, b) => {
    const rank = (m: MetricRow) => (m.metric_type === "primary" ? 0 : 1);
    return rank(a) - rank(b);
  });
  const variantRows = [...(row.variants ?? [])].sort(
    (a, b) => (a.is_control ? 0 : 1) - (b.is_control ? 0 : 1)
  );
  const resultRows = row.results ?? [];

  const primaryRow = metricRows.find((m) => m.metric_type === "primary");
  const guardrailRows = metricRows.filter((m) => m.metric_type === "guardrail");

  const controlVariant = variantRows.find((v) => v.is_control) ?? variantRows[0];

  const resultFor = (variantId: string, metricId: string): ResultRow | undefined =>
    resultRows.find((r) => r.variant_id === variantId && r.metric_id === metricId);

  const variants: Variant[] = variantRows.map((v) => {
    const variantResults = resultRows.filter((r) => r.variant_id === v.id);
    const sampleSize = variantResults.reduce(
      (max, r) => Math.max(max, r.sample_size ?? 0),
      0
    );
    const metrics: VariantMetric[] = [];
    for (const m of metricRows) {
      const r = resultFor(v.id, m.id);
      if (!r) continue;
      const observed = Number(r.observed_value ?? 0);
      const controlResult =
        controlVariant && controlVariant.id !== v.id
          ? resultFor(controlVariant.id, m.id)
          : undefined;
      const reference =
        controlResult?.observed_value != null
          ? Number(controlResult.observed_value)
          : m.baseline_value != null
            ? Number(m.baseline_value)
            : null;
      const significant = r.is_significant ?? false;
      const ci = Array.isArray(r.confidence_interval)
        ? ([Number(r.confidence_interval[0]), Number(r.confidence_interval[1])] as [
            number,
            number,
          ])
        : ([observed, observed] as [number, number]);
      metrics.push({
        name: m.name,
        value: observed,
        confidenceInterval: ci,
        pValue: Number(r.p_value ?? 1),
        significant,
        direction: deriveVariantMetricDirection(
          significant,
          (m.direction as MetricDirection) || "increase",
          observed,
          reference
        ),
      });
    }
    return {
      id: v.id,
      name: v.name,
      allocation: Number(v.allocation_pct ?? 0),
      sampleSize,
      metrics,
    };
  });

  const totalSampleSize = variants.reduce((sum, v) => sum + v.sampleSize, 0);
  const status = (row.status as ExperimentStatus) || "design";

  const createdBy =
    currentUser && row.owner_id === currentUser.userId
      ? currentUser.fullName || currentUser.email || "You"
      : "Team member";

  return {
    id: row.id,
    name: row.name,
    hypothesis: row.hypothesis ?? "",
    type: (row.experiment_type as ExperimentType) || "a/b-test",
    status,
    outcome: status === "concluded" ? decisionToOutcome(row.decision) : null,
    primaryMetric: primaryRow
      ? mapMetric(primaryRow)
      : { name: "—", direction: "increase", minimumDetectableEffect: 0 },
    guardrailMetrics: guardrailRows.map(mapMetric),
    variants,
    startDate: toDateString(row.start_date),
    endDate: row.end_date ? toDateString(row.end_date) : null,
    totalSampleSize,
    requiredSampleSize: row.sample_size_target ?? 0,
    significanceLevel: Number(row.significance_level ?? 0.05),
    baselineRate: Number(row.baseline_rate ?? 0),
    keyLearning: row.key_learning ?? null,
    conclusion: row.conclusion ?? null,
    decision: (row.decision as Experiment["decision"]) ?? null,
    createdBy,
  };
}

// ---------------------------------------------------------------------------
// Experiments CRUD (children — variants, metrics, results — load via parent)
// ---------------------------------------------------------------------------

const EXPERIMENT_SELECT = "*, variants(*), metrics(*), results(*)";

export async function listExperiments(): Promise<Experiment[]> {
  const ctx = await getCtx();
  const { data, error } = await ctx.supabase
    .from("experiments")
    .select(EXPERIMENT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ExperimentRow[]).map((row) => mapExperiment(row, ctx));
}

export async function getExperimentById(id: string): Promise<Experiment | null> {
  const ctx = await getCtx();
  const { data, error } = await ctx.supabase
    .from("experiments")
    .select(EXPERIMENT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapExperiment(data as ExperimentRow, ctx);
}

export interface NewMetricInput {
  name: string;
  direction: MetricDirection;
  minimumDetectableEffect: number;
}

export interface NewVariantInput {
  name: string;
  allocationPct: number;
}

export interface NewExperimentInput {
  name: string;
  hypothesis: string;
  experimentType: string;
  primaryMetric: NewMetricInput;
  guardrailMetrics: NewMetricInput[];
  variants: NewVariantInput[];
  baselineRate: number;
  significanceLevel: number;
  sampleSizeTarget: number;
}

export async function createExperiment(input: NewExperimentInput): Promise<string> {
  const { supabase, orgId, userId } = await getCtx();
  const { data: exp, error } = await supabase
    .from("experiments")
    .insert({
      org_id: orgId,
      owner_id: userId,
      name: input.name,
      hypothesis: input.hypothesis,
      status: "design",
      experiment_type: input.experimentType,
      // Leave start_date null while in 'design'; updateExperimentStatus sets it
      // when the experiment transitions to 'running'.
      sample_size_target: input.sampleSizeTarget,
      baseline_rate: input.baselineRate,
      significance_level: input.significanceLevel,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const experimentId = (exp as { id: string }).id;

  const metricRows = [
    {
      experiment_id: experimentId,
      name: input.primaryMetric.name,
      metric_type: "primary",
      direction: input.primaryMetric.direction,
      minimum_detectable_effect: input.primaryMetric.minimumDetectableEffect,
      baseline_value: input.baselineRate,
    },
    ...input.guardrailMetrics.map((m) => ({
      experiment_id: experimentId,
      name: m.name,
      metric_type: "guardrail",
      direction: m.direction,
      minimum_detectable_effect: m.minimumDetectableEffect,
      baseline_value: null as number | null,
    })),
  ];
  const { error: metricsError } = await supabase.from("metrics").insert(metricRows);
  if (metricsError) throw new Error(metricsError.message);

  const variantRows = input.variants.map((v, i) => ({
    experiment_id: experimentId,
    name: v.name,
    is_control: i === 0,
    allocation_pct: v.allocationPct,
    config: {},
  }));
  const { error: variantsError } = await supabase.from("variants").insert(variantRows);
  if (variantsError) throw new Error(variantsError.message);

  return experimentId;
}

export async function updateExperimentStatus(
  id: string,
  status: ExperimentStatus
): Promise<void> {
  const { supabase } = await getCtx();
  const patch: Record<string, unknown> = { status };
  if (status === "running") patch.start_date = new Date().toISOString();
  if (status === "concluded") patch.end_date = new Date().toISOString();
  const { error } = await supabase.from("experiments").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function concludeExperiment(
  id: string,
  input: { decision: "ship" | "iterate" | "discard"; conclusion: string; keyLearning: string }
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase
    .from("experiments")
    .update({
      status: "concluded",
      end_date: new Date().toISOString(),
      decision: input.decision,
      conclusion: input.conclusion,
      key_learning: input.keyLearning,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteExperiment(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("experiments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Methodology templates CRUD (library)
// ---------------------------------------------------------------------------

export interface MethodologyTemplate {
  id: string;
  name: string;
  description: string;
  experimentType: string;
  defaultConfig: Record<string, unknown>;
  checklist: string[];
  isPublic: boolean;
  createdAt: string;
}

function mapTemplate(row: TemplateRow): MethodologyTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    experimentType: row.experiment_type ?? "a/b-test",
    defaultConfig: row.default_config ?? {},
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
    isPublic: row.is_public ?? false,
    createdAt: toDateString(row.created_at),
  };
}

export interface TemplateInput {
  name: string;
  description: string;
  experimentType: string;
  checklist: string[];
}

export async function listTemplates(): Promise<MethodologyTemplate[]> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("methodology_templates")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as TemplateRow[]).map(mapTemplate);
}

export async function createTemplate(input: TemplateInput): Promise<MethodologyTemplate> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("methodology_templates")
    .insert({
      org_id: orgId,
      name: input.name,
      description: input.description,
      experiment_type: input.experimentType,
      default_config: {},
      checklist: input.checklist,
      is_public: false,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapTemplate(data as TemplateRow);
}

export async function updateTemplate(
  id: string,
  input: TemplateInput
): Promise<MethodologyTemplate> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("methodology_templates")
    .update({
      name: input.name,
      description: input.description,
      experiment_type: input.experimentType,
      checklist: input.checklist,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapTemplate(data as TemplateRow);
}

export async function deleteTemplate(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("methodology_templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Demo seeding — repurposes the static seed arrays with real org/user ids,
// FK chains (experiments → variants/metrics → results), dates rebased to today
// ---------------------------------------------------------------------------

const SEED_DATE_ANCHOR = Date.UTC(2026, 3, 10); // seed dataset's implied "today"

function shiftSeedDate(seedDate: string | null): string | null {
  if (!seedDate) return null;
  const t = Date.parse(`${seedDate}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return new Date(Date.now() + (t - SEED_DATE_ANCHOR)).toISOString();
}

const TEMPLATE_SEEDS: TemplateInput[] = [
  {
    name: "A/B Testing Protocol",
    description:
      "The gold standard for causal inference. Split traffic between control and treatment to measure the impact of a single change.",
    experimentType: "a/b-test",
    checklist: [
      "Define a specific, falsifiable hypothesis with a measurable outcome",
      "Select a primary metric and set guardrail metrics",
      "Calculate required sample size from baseline rate, MDE, and alpha",
      "Implement randomized assignment with consistent bucketing",
      "Run until the predetermined sample size is reached — no peeking",
      "Analyze at the pre-specified alpha and document the decision",
    ],
  },
  {
    name: "Multivariate Testing",
    description:
      "Test multiple variables simultaneously to find the best combination and understand interaction effects.",
    experimentType: "multivariate",
    checklist: [
      "Identify independent variables and their levels",
      "Choose full vs fractional factorial design",
      "Power the smallest cell before starting",
      "Analyze main effects and interactions with ANOVA or regression",
      "Validate the winning combination with a follow-up A/B test",
    ],
  },
  {
    name: "Before/After Analysis",
    description:
      "Compare metrics before and after a change when randomization is not feasible — infrastructure, pricing, or policy changes.",
    experimentType: "before-after",
    checklist: [
      "Establish a stable baseline period (2-4 weeks minimum)",
      "Document confounders and seasonal patterns",
      "Implement the change with a clear cutoff timestamp",
      "Use interrupted time series or difference-in-differences",
      "Report effect sizes with uncertainty bounds",
    ],
  },
];

export async function seedDemoData(): Promise<void> {
  const ctx = await getCtx();
  const { supabase, orgId, userId } = ctx;

  for (const seed of experimentSeeds) {
    const { data: exp, error } = await supabase
      .from("experiments")
      .insert({
        org_id: orgId,
        owner_id: userId,
        name: seed.name,
        hypothesis: seed.hypothesis,
        status: seed.status,
        experiment_type: seed.type,
        start_date: shiftSeedDate(seed.startDate),
        end_date: shiftSeedDate(seed.endDate),
        sample_size_target: seed.requiredSampleSize,
        baseline_rate: seed.baselineRate,
        significance_level: seed.significanceLevel,
        decision: seed.decision,
        conclusion: seed.conclusion,
        key_learning: seed.keyLearning,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const experimentId = (exp as { id: string }).id;

    // Metrics (primary + guardrails), capture ids by name
    const control = seed.variants[0];
    const treatment = seed.variants[seed.variants.length - 1];
    const metricRows = [
      {
        experiment_id: experimentId,
        name: seed.primaryMetric.name,
        metric_type: "primary",
        direction: seed.primaryMetric.direction,
        minimum_detectable_effect: seed.primaryMetric.minimumDetectableEffect,
        baseline_value:
          control.metrics.find((m) => m.name === seed.primaryMetric.name)?.value ??
          seed.baselineRate,
        current_value:
          treatment.metrics.find((m) => m.name === seed.primaryMetric.name)?.value ?? null,
      },
      ...seed.guardrailMetrics.map((gm) => ({
        experiment_id: experimentId,
        name: gm.name,
        metric_type: "guardrail",
        direction: gm.direction,
        minimum_detectable_effect: gm.minimumDetectableEffect,
        baseline_value: control.metrics.find((m) => m.name === gm.name)?.value ?? null,
        current_value: treatment.metrics.find((m) => m.name === gm.name)?.value ?? null,
      })),
    ];
    const { data: insertedMetrics, error: metricsError } = await supabase
      .from("metrics")
      .insert(metricRows)
      .select("id, name");
    if (metricsError) throw new Error(metricsError.message);
    const metricIdByName = new Map<string, string>(
      ((insertedMetrics ?? []) as { id: string; name: string }[]).map((m) => [m.name, m.id])
    );

    // Variants, capture ids by name
    const variantRows = seed.variants.map((v, i) => ({
      experiment_id: experimentId,
      name: v.name,
      is_control: i === 0,
      allocation_pct: v.allocation,
      config: {},
    }));
    const { data: insertedVariants, error: variantsError } = await supabase
      .from("variants")
      .insert(variantRows)
      .select("id, name");
    if (variantsError) throw new Error(variantsError.message);
    const variantIdByName = new Map<string, string>(
      ((insertedVariants ?? []) as { id: string; name: string }[]).map((v) => [v.name, v.id])
    );

    // Results (FKs to experiment + variant + metric)
    const resultRows: Record<string, unknown>[] = [];
    for (const v of seed.variants) {
      const variantId = variantIdByName.get(v.name);
      if (!variantId) continue;
      for (const vm of v.metrics) {
        const metricId = metricIdByName.get(vm.name);
        if (!metricId) continue;
        resultRows.push({
          experiment_id: experimentId,
          variant_id: variantId,
          metric_id: metricId,
          observed_value: vm.value,
          confidence_interval: vm.confidenceInterval,
          p_value: vm.pValue,
          is_significant: vm.significant,
          sample_size: v.sampleSize,
        });
      }
    }
    if (resultRows.length > 0) {
      const { error: resultsError } = await supabase.from("results").insert(resultRows);
      if (resultsError) throw new Error(resultsError.message);
    }
  }

  // Methodology templates for the library (skip any that already exist)
  const { data: existingTemplates, error: templatesError } = await supabase
    .from("methodology_templates")
    .select("name");
  if (templatesError) throw new Error(templatesError.message);
  const existingNames = new Set(
    ((existingTemplates ?? []) as { name: string }[]).map((t) => t.name)
  );
  const newTemplates = TEMPLATE_SEEDS.filter((t) => !existingNames.has(t.name)).map((t) => ({
    org_id: orgId,
    name: t.name,
    description: t.description,
    experiment_type: t.experimentType,
    default_config: {},
    checklist: t.checklist,
    is_public: false,
  }));
  if (newTemplates.length > 0) {
    const { error: seedTemplatesError } = await supabase
      .from("methodology_templates")
      .insert(newTemplates);
    if (seedTemplatesError) throw new Error(seedTemplatesError.message);
  }
}
