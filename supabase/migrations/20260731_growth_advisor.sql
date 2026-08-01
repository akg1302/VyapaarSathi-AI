create type public.growth_recommendation_kind as enum ('revenue_opportunity','cross_sell','upsell','bundle','seasonal','slow_moving','fast_moving');
create type public.growth_recommendation_status as enum ('active','dismissed','acted');
create table public.growth_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  kind public.growth_recommendation_kind not null,
  title text not null,
  description text not null,
  estimated_revenue_increase numeric(12,2) not null check (estimated_revenue_increase >= 0),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  priority public.priority not null,
  related_product_ids uuid[] not null default '{}',
  status public.growth_recommendation_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.growth_recommendations(user_id, status, created_at desc);
alter table public.growth_recommendations enable row level security;
create policy "Growth recommendations access own data" on public.growth_recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
