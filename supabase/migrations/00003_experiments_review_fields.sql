-- dynamic-fi: experiment review/conclusion fields
-- Migration: 00003_experiments_review_fields
-- (applied to the shared Supabase project as aalto_experiments_review_fields)

alter table public.experiments
  add column if not exists baseline_rate numeric,
  add column if not exists significance_level numeric,
  add column if not exists decision text,
  add column if not exists conclusion text,
  add column if not exists key_learning text;
