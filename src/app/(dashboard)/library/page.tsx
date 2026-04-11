"use client";

import { useState } from "react";
import Link from "next/link";
import { getConcludedExperiments } from "@/lib/data/experiments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, AlertCircle, XCircle, ArrowRight } from "lucide-react";

const outcomeConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  shipped: {
    icon: <CheckCircle className="h-4 w-4" />,
    label: "Shipped",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  iterated: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Iterated",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  discarded: {
    icon: <XCircle className="h-4 w-4" />,
    label: "Discarded",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const concluded = getConcludedExperiments();

  const filtered = search
    ? concluded.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.hypothesis.toLowerCase().includes(search.toLowerCase()) ||
          (e.keyLearning && e.keyLearning.toLowerCase().includes(search.toLowerCase()))
      )
    : concluded;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground">
          Archive of concluded experiments. Institutional memory for your team.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search experiments, hypotheses, learnings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span>
          {concluded.filter((e) => e.outcome === "shipped").length} shipped
        </span>
        <span>
          {concluded.filter((e) => e.outcome === "iterated").length} iterated
        </span>
        <span>
          {concluded.filter((e) => e.outcome === "discarded").length} discarded
        </span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {search ? "No experiments match your search." : "No concluded experiments yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp) => {
            const oc = outcomeConfig[exp.outcome || ""] || outcomeConfig.discarded;
            return (
              <Link key={exp.id} href={`/experiments/${exp.id}`}>
                <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${oc.className}`}
                      >
                        {oc.icon}
                        {oc.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {exp.endDate}
                      </span>
                    </div>
                    <CardTitle className="text-base">{exp.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {exp.hypothesis}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {exp.keyLearning}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground">
                      View details <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
