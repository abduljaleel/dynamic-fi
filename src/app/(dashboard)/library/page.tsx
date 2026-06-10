"use client";

import { useEffect, useState } from "react";
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  updateTemplate,
  type MethodologyTemplate,
  type TemplateInput,
} from "@/lib/data/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, ListChecks, Loader2 } from "lucide-react";

const typeConfig: Record<string, { label: string; className: string }> = {
  "a/b-test": {
    label: "A/B Test",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  multivariate: {
    label: "Multivariate",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  "before-after": {
    label: "Before/After",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

interface TemplateFormState {
  name: string;
  description: string;
  experimentType: string;
  checklistText: string;
}

const emptyForm: TemplateFormState = {
  name: "",
  description: "",
  experimentType: "a/b-test",
  checklistText: "",
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState<MethodologyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listTemplates();
        if (!cancelled) setTemplates(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load templates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (template: MethodologyTemplate) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      description: template.description,
      experimentType: template.experimentType,
      checklistText: template.checklist.join("\n"),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    const input: TemplateInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      experimentType: form.experimentType,
      checklist: form.checklistText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        const updated = await updateTemplate(editingId, input);
        setTemplates((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await createTemplate(input);
        setTemplates((prev) => [...prev, created]);
      }
      setDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = search
    ? templates.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.checklist.some((item) => item.toLowerCase().includes(search.toLowerCase()))
      )
    : templates;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground">
            Methodology templates. Institutional memory for your team.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates, descriptions, checklists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span>{templates.filter((t) => t.experimentType === "a/b-test").length} A/B test</span>
        <span>
          {templates.filter((t) => t.experimentType === "multivariate").length} multivariate
        </span>
        <span>
          {templates.filter((t) => t.experimentType === "before-after").length} before/after
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3 space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {search
              ? "No templates match your search."
              : "No methodology templates yet. Create one to standardize how your team runs experiments."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const tc = typeConfig[template.experimentType] || {
              label: template.experimentType,
              className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
            };
            return (
              <Card
                key={template.id}
                className="hover:border-foreground/20 transition-colors h-full flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tc.className}`}
                    >
                      {tc.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{template.createdAt}</span>
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ListChecks className="h-3.5 w-3.5" />
                    {template.checklist.length} checklist{" "}
                    {template.checklist.length === 1 ? "item" : "items"}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(template)}
                      disabled={deletingId === template.id}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => void handleDelete(template.id)}
                      disabled={deletingId === template.id}
                    >
                      {deletingId === template.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>
              Codify a repeatable methodology your team can start experiments from.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., A/B Testing Protocol"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-type">Experiment Type</Label>
              <Select
                value={form.experimentType}
                onValueChange={(v) => setForm({ ...form, experimentType: v ?? "a/b-test" })}
              >
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
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                rows={3}
                placeholder="What is this methodology for, and when should the team use it?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-checklist">Checklist (one item per line)</Label>
              <Textarea
                id="template-checklist"
                rows={5}
                placeholder={"Define a falsifiable hypothesis\nCalculate sample size\nRun until target sample is reached"}
                value={form.checklistText}
                onChange={(e) => setForm({ ...form, checklistText: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={!form.name.trim() || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
