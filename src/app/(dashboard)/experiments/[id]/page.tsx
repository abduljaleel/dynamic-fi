"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getExperiment } from "@/lib/data/experiments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const statusStyles: Record<string, string> = {
  design: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  running: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  analyzing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  concluded: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
};

const typeLabels: Record<string, string> = {
  "a/b-test": "A/B Test",
  multivariate: "Multivariate",
  "before-after": "Before/After",
};

export default function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const experiment = getExperiment(id);

  const [decision, setDecision] = useState(experiment?.decision || "");
  const [learnings, setLearnings] = useState(experiment?.keyLearning || "");
  const [conclusionText, setConclusionText] = useState(experiment?.conclusion || "");

  if (!experiment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/experiments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Experiment not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = Math.round(
    (experiment.totalSampleSize / experiment.requiredSampleSize) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/experiments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{experiment.name}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[experiment.status]}`}
              >
                {experiment.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {typeLabels[experiment.type]} &middot; Created by {experiment.createdBy}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hypothesis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{experiment.hypothesis}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Primary
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {experiment.primaryMetric.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {experiment.primaryMetric.direction} by{" "}
                      {experiment.primaryMetric.minimumDetectableEffect}%
                    </span>
                  </div>
                </div>
                {experiment.guardrailMetrics.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Guardrails
                    </p>
                    {experiment.guardrailMetrics.map((gm, i) => (
                      <div key={i} className="flex items-center justify-between mt-1">
                        <span className="text-sm">{gm.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {gm.direction} by {gm.minimumDetectableEffect}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {experiment.variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{v.name}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{v.allocation}%</span>
                      <span className="font-mono text-xs">
                        n={v.sampleSize.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{experiment.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{experiment.endDate || "In progress"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Significance Level</p>
                  <p className="font-medium font-mono">{experiment.significanceLevel}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sample progress</span>
                  <span className="font-mono">
                    {experiment.totalSampleSize.toLocaleString()} /{" "}
                    {experiment.requiredSampleSize.toLocaleString()} ({Math.min(progress, 100)}
                    %)
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {experiment.variants[0].metrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No results yet. This experiment is still in the design phase.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results per metric */}
              {experiment.variants[0].metrics.map((_, metricIndex) => {
                const metricName = experiment.variants[0].metrics[metricIndex].name;
                const isPrimary = metricName === experiment.primaryMetric.name;
                return (
                  <Card key={metricName}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{metricName}</CardTitle>
                        {isPrimary && (
                          <span className="text-xs font-medium bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Variant</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">95% CI</TableHead>
                            <TableHead className="text-right">p-value</TableHead>
                            <TableHead className="text-right">Significance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {experiment.variants.map((variant) => {
                            const metric = variant.metrics[metricIndex];
                            if (!metric) return null;
                            return (
                              <TableRow key={variant.id}>
                                <TableCell className="font-medium">
                                  {variant.name}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {metric.value}
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                  [{metric.confidenceInterval[0]},{" "}
                                  {metric.confidenceInterval[1]}]
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs">
                                  {metric.pValue === 1 ? "--" : metric.pValue.toFixed(4)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <SignificanceBadge
                                    significant={metric.significant}
                                    direction={metric.direction}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          {experiment.status === "concluded" && experiment.decision ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <DecisionBadge decision={experiment.decision} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conclusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{experiment.conclusion}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Learnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{experiment.keyLearning}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Conclude Experiment</CardTitle>
                <CardDescription>
                  Record your decision and capture learnings for the team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Decision</Label>
                  <div className="flex gap-2">
                    {(["ship", "iterate", "discard"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDecision(d)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          decision === d
                            ? d === "ship"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : d === "iterate"
                                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "hover:bg-muted"
                        }`}
                      >
                        {d === "ship" && "Ship"}
                        {d === "iterate" && "Iterate"}
                        {d === "discard" && "Discard"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conclusion">Conclusion</Label>
                  <Textarea
                    id="conclusion"
                    rows={3}
                    placeholder="Summarize the experiment outcome and rationale for the decision."
                    value={conclusionText}
                    onChange={(e) => setConclusionText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learnings">Key Learnings</Label>
                  <Textarea
                    id="learnings"
                    rows={3}
                    placeholder="What did the team learn? What should inform future experiments?"
                    value={learnings}
                    onChange={(e) => setLearnings(e.target.value)}
                  />
                </div>
                <Button disabled={!decision}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Conclusion
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SignificanceBadge({
  significant,
  direction,
}: {
  significant: boolean;
  direction: string;
}) {
  if (!significant) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        <Minus className="h-3 w-3" />
        Not significant
      </span>
    );
  }
  if (direction === "positive") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        <ArrowUpRight className="h-3 w-3" />
        Significant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
      <ArrowDownRight className="h-3 w-3" />
      Significant
    </span>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    ship: {
      icon: <CheckCircle className="h-5 w-5" />,
      label: "Ship",
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    },
    iterate: {
      icon: <AlertCircle className="h-5 w-5" />,
      label: "Iterate",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    discard: {
      icon: <XCircle className="h-5 w-5" />,
      label: "Discard",
      className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
  };

  const c = config[decision];
  if (!c) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${c.className}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
