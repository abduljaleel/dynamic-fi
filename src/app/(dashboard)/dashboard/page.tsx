import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  experiments,
  getExperimentStats,
  getActiveExperiments,
  getConcludedExperiments,
} from "@/lib/data/experiments";
import { Zap, FlaskConical, TrendingUp, Clock, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = getExperimentStats();
  const active = getActiveExperiments();
  const concluded = getConcludedExperiments().slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

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
            <CardContent className="py-8 text-center text-muted-foreground">
              No active experiments. Design a new one to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((exp) => {
              const progress = Math.round(
                (exp.totalSampleSize / exp.requiredSampleSize) * 100
              );
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
