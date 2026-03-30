-- Widgets table
create table public.widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  business_name text not null,
  google_place_url text,
  style text not null check (style in ('card', 'carousel', 'grid', 'badge', 'floating')),
  primary_color text default '#f59e0b',
  background_color text default '#1a1a1a',
  text_color text default '#ffffff',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Widget configurations table (advanced settings per widget)
create table public.widget_configs (
  id uuid primary key default gen_random_uuid(),
  widget_id uuid references public.widgets(id) on delete cascade not null unique,
  show_branding boolean default true,
  auto_rotate boolean default true,
  rotate_interval integer default 5000,
  max_reviews integer default 10,
  custom_css text,
  position text default 'bottom-right' check (position in ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
  created_at timestamptz default now()
);

-- Reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  widget_id uuid references public.widgets(id) on delete cascade not null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text,
  source text default 'manual',
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

alter table public.widget_configs enable row level security;
create policy "Users manage own widget configs" on public.widget_configs
  for all using (widget_id in (select id from public.widgets where user_id = auth.uid()));
create policy "Public can read widget configs" on public.widget_configs
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

-- Indexes
create index idx_impressions_widget_date on public.impressions (widget_id, recorded_at);
create index idx_reviews_widget on public.reviews (widget_id);
create index idx_widgets_user on public.widgets (user_id);
