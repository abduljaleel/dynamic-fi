"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Experiment, type ExperimentStatus } from "@/lib/data/experiments";
import { listExperiments } from "@/lib/data/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

const statusFilters: { label: string; value: ExperimentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Design", value: "design" },
  { label: "Running", value: "running" },
  { label: "Analyzing", value: "analyzing" },
  { label: "Concluded", value: "concluded" },
];

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

export default function ExperimentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<ExperimentStatus | "all">("all");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listExperiments();
        if (!cancelled) setExperiments(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load experiments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    filter === "all" ? experiments : experiments.filter((e) => e.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
          <p className="text-muted-foreground">
            Design, run, and analyze experiments with statistical rigor.
          </p>
        </div>
        <Link href="/experiments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Experiment
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                {experiments.filter((e) => e.status === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Sample Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [0, 1, 2].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {experiments.length === 0
                      ? "No experiments yet. Create one to get started."
                      : "No experiments match this filter."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((exp) => (
                  <TableRow
                    key={exp.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/experiments/${exp.id}`)}
                  >
                    <TableCell>
                      <Link
                        href={`/experiments/${exp.id}`}
                        className="font-medium hover:underline"
                      >
                        {exp.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {typeLabels[exp.type] ?? exp.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[exp.status]}`}
                      >
                        {exp.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {exp.startDate || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {exp.totalSampleSize.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
