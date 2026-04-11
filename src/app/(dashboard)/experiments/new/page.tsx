"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Calculator,
} from "lucide-react";

interface MetricDef {
  name: string;
  direction: "increase" | "decrease";
  mde: string;
}

interface VariantDef {
  name: string;
  allocation: string;
}

const STEPS = [
  "Hypothesis",
  "Metrics",
  "Variants",
  "Sample Size",
  "Review & Launch",
];

function calculateSampleSize(
  baselineRate: number,
  mde: number,
  alpha: number,
  power: number = 0.8
): number {
  // Using the formula: n = (Z_alpha/2 + Z_beta)^2 * (p1(1-p1) + p2(1-p2)) / (p2 - p1)^2
  // Where p1 = baseline, p2 = baseline * (1 + mde/100)
  const zAlpha = alpha === 0.05 ? 1.96 : alpha === 0.01 ? 2.576 : 1.645;
  const zBeta = power === 0.8 ? 0.842 : power === 0.9 ? 1.282 : 0.674;

  const p1 = baselineRate / 100;
  const p2 = p1 * (1 + mde / 100);

  if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1 || p1 === p2) return 0;

  const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);

  return Math.ceil(numerator / denominator);
}

export default function NewExperimentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1: Hypothesis
  const [hypothesis, setHypothesis] = useState("");
  const [experimentType, setExperimentType] = useState("a/b-test");
  const [experimentName, setExperimentName] = useState("");

  // Step 2: Metrics
  const [primaryMetric, setPrimaryMetric] = useState<MetricDef>({
    name: "",
    direction: "increase",
    mde: "",
  });
  const [guardrailMetrics, setGuardrailMetrics] = useState<MetricDef[]>([]);

  // Step 3: Variants
  const [variants, setVariants] = useState<VariantDef[]>([
    { name: "Control", allocation: "50" },
    { name: "Treatment", allocation: "50" },
  ]);

  // Step 4: Sample size
  const [baselineRate, setBaselineRate] = useState("");
  const [significanceLevel, setSignificanceLevel] = useState("0.05");

  const requiredPerVariant = calculateSampleSize(
    parseFloat(baselineRate) || 0,
    parseFloat(primaryMetric.mde) || 0,
    parseFloat(significanceLevel)
  );
  const totalRequired = requiredPerVariant * variants.length;

  const addGuardrailMetric = () => {
    setGuardrailMetrics([...guardrailMetrics, { name: "", direction: "increase", mde: "" }]);
  };

  const removeGuardrailMetric = (index: number) => {
    setGuardrailMetrics(guardrailMetrics.filter((_, i) => i !== index));
  };

  const updateGuardrailMetric = (index: number, field: keyof MetricDef, value: string) => {
    const updated = [...guardrailMetrics];
    updated[index] = { ...updated[index], [field]: value };
    setGuardrailMetrics(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", allocation: "0" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantDef, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return experimentName.trim() && hypothesis.trim();
      case 1:
        return primaryMetric.name.trim() && primaryMetric.mde;
      case 2:
        return variants.length >= 2 && variants.every((v) => v.name.trim());
      case 3:
        return baselineRate && totalRequired > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/experiments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Experiment</h1>
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-foreground" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Define Your Hypothesis</CardTitle>
            <CardDescription>
              A good hypothesis is specific, measurable, and falsifiable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Experiment Name</Label>
              <Input
                id="name"
                placeholder="e.g., Checkout Flow Simplification"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Experiment Type</Label>
              <Select value={experimentType} onValueChange={(v) => setExperimentType(v ?? "a/b-test")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a/b-test">A/B Test</SelectItem>
                  <SelectItem value="multivariate">Multivariate</SelectItem>
                  <SelectItem value="before-after">Before/After</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hypothesis">Hypothesis Statement</Label>
              <Textarea
                id="hypothesis"
                rows={4}
                placeholder="If we [change], then [metric] will [improve/decrease] by [amount] because [reason]."
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Template: &quot;If we [change X], then [metric Y] will [direction] by at
                least [Z%] because [reason].&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary Metric</CardTitle>
              <CardDescription>
                The single metric that determines experiment success.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Metric Name</Label>
                  <Input
                    placeholder="e.g., Conversion Rate"
                    value={primaryMetric.name}
                    onChange={(e) =>
                      setPrimaryMetric({ ...primaryMetric, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select
                    value={primaryMetric.direction}
                    onValueChange={(v) =>
                      setPrimaryMetric({
                        ...primaryMetric,
                        direction: v as "increase" | "decrease",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Detectable Effect (%)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={primaryMetric.mde}
                  onChange={(e) =>
                    setPrimaryMetric({ ...primaryMetric, mde: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  The smallest effect size you consider practically significant.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Guardrail Metrics</CardTitle>
                  <CardDescription>
                    Metrics that must not degrade during the experiment.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addGuardrailMetric}>
                  <Plus className="mr-2 h-3 w-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            {guardrailMetrics.length > 0 && (
              <CardContent className="space-y-4">
                {guardrailMetrics.map((gm, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Metric name"
                        value={gm.name}
                        onChange={(e) => updateGuardrailMetric(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <Label className="text-xs">Direction</Label>
                      <Select
                        value={gm.direction}
                        onValueChange={(v) => updateGuardrailMetric(i, "direction", v ?? "increase")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase">Increase</SelectItem>
                          <SelectItem value="decrease">Decrease</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">MDE (%)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 2"
                        value={gm.mde}
                        onChange={(e) => updateGuardrailMetric(i, "mde", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuardrailMetric(i)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Configure Variants</CardTitle>
                <CardDescription>
                  Define your control and treatment groups with traffic allocation.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addVariant}>
                <Plus className="mr-2 h-3 w-3" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">
                    Variant Name {i === 0 && "(Control)"}
                  </Label>
                  <Input
                    placeholder={i === 0 ? "Control" : `Treatment ${i}`}
                    value={v.name}
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-1">
                  <Label className="text-xs">Allocation (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={v.allocation}
                    onChange={(e) => updateVariant(i, "allocation", e.target.value)}
                  />
                </div>
                {variants.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(i)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total allocation</span>
              <span
                className={`font-mono font-medium ${
                  variants.reduce((sum, v) => sum + (parseInt(v.allocation) || 0), 0) ===
                  100
                    ? "text-emerald-600"
                    : "text-destructive"
                }`}
              >
                {variants.reduce((sum, v) => sum + (parseInt(v.allocation) || 0), 0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Sample Size Calculator
            </CardTitle>
            <CardDescription>
              Determine the required sample size for statistical significance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Baseline Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 3.2"
                  value={baselineRate}
                  onChange={(e) => setBaselineRate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current conversion/metric rate
                </p>
              </div>
              <div className="space-y-2">
                <Label>Minimum Detectable Effect (%)</Label>
                <Input type="number" value={primaryMetric.mde} disabled />
                <p className="text-xs text-muted-foreground">Set in metrics step</p>
              </div>
              <div className="space-y-2">
                <Label>Significance Level (alpha)</Label>
                <Select value={significanceLevel} onValueChange={(v) => setSignificanceLevel(v ?? "0.05")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.10 (90% confidence)</SelectItem>
                    <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                    <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statistical Power</Label>
                <Input type="text" value="80%" disabled />
                <p className="text-xs text-muted-foreground">
                  Standard power level (1 - beta)
                </p>
              </div>
            </div>

            <Separator />

            {/* Formula */}
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Formula
              </p>
              <p className="font-mono text-sm">
                n = (Z_alpha/2 + Z_beta)^2 * [p1(1-p1) + p2(1-p2)] / (p2 - p1)^2
              </p>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <p>Where:</p>
                <p>
                  p1 = {baselineRate ? `${baselineRate}%` : "baseline rate"}, p2 = p1 *
                  (1 + MDE/100) ={" "}
                  {baselineRate && primaryMetric.mde
                    ? `${(
                        (parseFloat(baselineRate) / 100) *
                        (1 + parseFloat(primaryMetric.mde) / 100) *
                        100
                      ).toFixed(2)}%`
                    : "target rate"}
                </p>
                <p>
                  Z_alpha/2 ={" "}
                  {significanceLevel === "0.05"
                    ? "1.96"
                    : significanceLevel === "0.01"
                      ? "2.576"
                      : "1.645"}
                  , Z_beta = 0.842
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-lg border-2 border-foreground/10 p-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Required Sample Size</p>
              <p className="text-4xl font-bold font-mono">
                {totalRequired > 0 ? totalRequired.toLocaleString() : "--"}
              </p>
              <p className="text-xs text-muted-foreground">
                {requiredPerVariant > 0
                  ? `${requiredPerVariant.toLocaleString()} per variant x ${variants.length} variants`
                  : "Enter baseline rate to calculate"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Launch</CardTitle>
            <CardDescription>
              Confirm your experiment configuration before launching.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Section title="Experiment">
              <ReviewRow label="Name" value={experimentName} />
              <ReviewRow
                label="Type"
                value={
                  experimentType === "a/b-test"
                    ? "A/B Test"
                    : experimentType === "multivariate"
                      ? "Multivariate"
                      : "Before/After"
                }
              />
            </Section>

            <Separator />

            <Section title="Hypothesis">
              <p className="text-sm">{hypothesis}</p>
            </Section>

            <Separator />

            <Section title="Primary Metric">
              <ReviewRow label="Metric" value={primaryMetric.name} />
              <ReviewRow label="Direction" value={primaryMetric.direction} />
              <ReviewRow label="MDE" value={`${primaryMetric.mde}%`} />
            </Section>

            {guardrailMetrics.length > 0 && (
              <>
                <Separator />
                <Section title="Guardrail Metrics">
                  {guardrailMetrics.map((gm, i) => (
                    <ReviewRow
                      key={i}
                      label={gm.name}
                      value={`${gm.direction} (MDE: ${gm.mde}%)`}
                    />
                  ))}
                </Section>
              </>
            )}

            <Separator />

            <Section title="Variants">
              {variants.map((v, i) => (
                <ReviewRow key={i} label={v.name} value={`${v.allocation}% allocation`} />
              ))}
            </Section>

            <Separator />

            <Section title="Sample Size">
              <ReviewRow label="Baseline Rate" value={`${baselineRate}%`} />
              <ReviewRow label="Significance Level" value={significanceLevel} />
              <ReviewRow label="Required Total" value={totalRequired.toLocaleString()} />
            </Section>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => router.push("/experiments")}>
            <Check className="mr-2 h-4 w-4" />
            Launch Experiment
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
