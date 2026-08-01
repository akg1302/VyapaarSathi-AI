create type public.ceo_brief_source as enum ('openai','deterministic');
create table public.ceo_briefs (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, brief text not null, business_health_explanation text not null, top_priorities text[] not null default '{}', business_risks text[] not null default '{}', growth_opportunities text[] not null default '{}', suggested_next_actions text[] not null default '{}', source public.ceo_brief_source not null, model text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index on public.ceo_briefs(user_id, created_at desc);
alter table public.ceo_briefs enable row level security;
create policy "CEO briefs access own data" on public.ceo_briefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
