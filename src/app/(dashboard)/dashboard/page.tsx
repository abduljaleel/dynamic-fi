"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { type Experiment } from "@/lib/data/experiments";
import { getProfileInfo, listExperiments, seedDemoData } from "@/lib/data/api";
import { Zap, FlaskConical, TrendingUp, Clock, ArrowRight, Database, Loader2 } from "lucide-react";

function computeStats(experiments: Experiment[]) {
  const total = experiments.length;
  const running = experiments.filter((e) => e.status === "running").length;
  const significant = experiments.filter(
    (e) =>
      e.status === "concluded" &&
      e.variants.some((v) => v.metrics.some((m) => m.significant && m.direction === "positive"))
  ).length;
  const concluded = experiments.filter((e) => e.status === "concluded" && e.endDate);
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

export default function DashboardPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, profile] = await Promise.all([listExperiments(), getProfileInfo()]);
      setExperiments(data);
      setUserName(profile.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load experiments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setSeeding(false);
    }
  };

  const stats = computeStats(experiments);
  const active = experiments.filter((e) => e.status === "running" || e.status === "analyzing");
  const concluded = experiments.filter((e) => e.status === "concluded").slice(0, 3);
  const isEmpty = !loading && experiments.length === 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your experiments...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userName}</p>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Experiments"
          value={String(stats.total)}
          description="All experiments across all stages"
          icon={<FlaskConical className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Running"
          value={String(stats.running)}
          description="Currently collecting data"
          icon={<Zap className="h-4 w-4 text-amber-500" />}
        />
        <MetricCard
          title="Significant Results"
          value={String(stats.significant)}
          description="Experiments with p < 0.05"
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
        />
        <MetricCard
          title="Avg Duration"
          value={`${stats.avgDuration}d`}
          description="Average experiment runtime"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Active Experiments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Experiments</h2>
          <Link
            href="/experiments"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {active.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground space-y-4">
              <p>No active experiments. Design a new one to get started.</p>
              {isEmpty && (
                <Button onClick={() => void handleSeed()} disabled={seeding}>
                  {seeding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  {seeding ? "Loading demo data..." : "Load demo data"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((exp) => {
              const progress =
                exp.requiredSampleSize > 0
                  ? Math.round((exp.totalSampleSize / exp.requiredSampleSize) * 100)
                  : 0;
              return (
                <Link key={exp.id} href={`/experiments/${exp.id}`}>
                  <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{exp.name}</CardTitle>
                        <StatusBadge status={exp.status} />
                      </div>
                      <CardDescription className="line-clamp-2 text-xs">
                        {exp.hypothesis}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sample progress</span>
                        <span className="font-mono text-xs">
                          {exp.totalSampleSize.toLocaleString()} /{" "}
                          {exp.requiredSampleSize.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Started {exp.startDate}</span>
                        <span>{exp.variants.length} variants</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Conclusions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Conclusions</h2>
          <Link
            href="/library"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View library <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {concluded.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No concluded experiments yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {concluded.map((exp) => (
              <Link key={exp.id} href={`/experiments/${exp.id}`}>
                <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{exp.name}</CardTitle>
                      <OutcomeBadge outcome={exp.outcome} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {exp.keyLearning}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    design: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    running: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    analyzing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    concluded: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[status] || ""}`}
    >
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: string | null }) {
  if (!outcome) return null;
  const variants: Record<string, string> = {
    shipped: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    iterated: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    discarded: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[outcome] || ""}`}
    >
      {outcome}
    </span>
  );
}
