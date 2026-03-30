-- Widgets table
create table public.widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  business_name text not null,
  style text not null check (style in ('card', 'carousel', 'grid', 'badge')),
  primary_color text default '#f59e0b',
  background_color text default '#1a1a1a',
  text_color text default '#ffffff',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  widget_id uuid references public.widgets(id) on delete cascade not null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz default now()
);

-- Impressions table
create table public.impressions (
  id bigint generated always as identity primary key,
  widget_id uuid references public.widgets(id) on delete cascade not null,
  recorded_at timestamptz default now()
);

-- RLS policies
alter table public.widgets enable row level security;
create policy "Users manage own widgets" on public.widgets
  for all using (auth.uid() = user_id);
create policy "Public can read widgets" on public.widgets
  for select using (true);

alter table public.reviews enable row level security;
create policy "Users manage reviews on own widgets" on public.reviews
  for all using (widget_id in (select id from public.widgets where user_id = auth.uid()));
create policy "Public can read reviews" on public.reviews
  for select using (true);

alter table public.impressions enable row level security;
create policy "Anyone can insert impressions" on public.impressions
  for insert with check (true);
create policy "Owners can view impressions" on public.impressions
  for select using (widget_id in (select id from public.widgets where user_id = auth.uid()));

-- Index for impression queries
create index idx_impressions_widget_date on public.impressions (widget_id, recorded_at);
