-- dynamic-fi: Experimentation platform tables
-- Migration: 00002_experiments

-- Experiments
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  hypothesis text,
  status text not null default 'design' check (status in ('design', 'running', 'analyzing', 'concluded')),
  experiment_type text,
  owner_id uuid references auth.users(id),
  start_date timestamptz,
  end_date timestamptz,
  sample_size_target int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.experiments enable row level security;

create policy "Users can view experiments in their org"
  on public.experiments for select
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can insert experiments in their org"
  on public.experiments for insert
  with check (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can update experiments in their org"
  on public.experiments for update
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can delete experiments in their org"
  on public.experiments for delete
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

-- Variants
create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  name text not null,
  description text,
  is_control boolean not null default false,
  config jsonb,
  allocation_pct numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.variants enable row level security;

create policy "Users can view variants via experiment org"
  on public.variants for select
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert variants via experiment org"
  on public.variants for insert
  with check (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update variants via experiment org"
  on public.variants for update
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete variants via experiment org"
  on public.variants for delete
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Metrics
create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  name text not null,
  metric_type text not null check (metric_type in ('primary', 'secondary', 'guardrail')),
  direction text not null check (direction in ('increase', 'decrease')),
  minimum_detectable_effect numeric,
  current_value numeric,
  baseline_value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.metrics enable row level security;

create policy "Users can view metrics via experiment org"
  on public.metrics for select
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert metrics via experiment org"
  on public.metrics for insert
  with check (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update metrics via experiment org"
  on public.metrics for update
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete metrics via experiment org"
  on public.metrics for delete
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Results
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  variant_id uuid references public.variants(id),
  metric_id uuid references public.metrics(id),
  observed_value numeric,
  confidence_interval jsonb,
  p_value numeric,
  is_significant boolean,
  sample_size int,
  computed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.results enable row level security;

create policy "Users can view results via experiment org"
  on public.results for select
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert results via experiment org"
  on public.results for insert
  with check (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update results via experiment org"
  on public.results for update
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete results via experiment org"
  on public.results for delete
  using (experiment_id in (
    select id from public.experiments where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Methodology Templates
create table if not exists public.methodology_templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  experiment_type text,
  default_config jsonb,
  checklist jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.methodology_templates enable row level security;

create policy "Users can view public or own org templates"
  on public.methodology_templates for select
  using (
    is_public = true
    or org_id in (select org_id from public.profiles where user_id = auth.uid())
  );

create policy "Users can insert templates in their org"
  on public.methodology_templates for insert
  with check (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can update templates in their org"
  on public.methodology_templates for update
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can delete templates in their org"
  on public.methodology_templates for delete
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));
