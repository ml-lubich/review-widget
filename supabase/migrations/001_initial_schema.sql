-- Widgets table
CREATE TABLE IF NOT EXISTS public.widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  google_place_url text,
  style text NOT NULL CHECK (style IN ('card', 'carousel', 'grid', 'badge', 'floating')),
  primary_color text DEFAULT '#f59e0b',
  background_color text DEFAULT '#1a1a1a',
  text_color text DEFAULT '#ffffff',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Widget configurations table (advanced settings per widget)
CREATE TABLE IF NOT EXISTS public.widget_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid REFERENCES public.widgets(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_branding boolean DEFAULT true,
  auto_rotate boolean DEFAULT true,
  rotate_interval integer DEFAULT 5000,
  max_reviews integer DEFAULT 10,
  custom_css text,
  position text DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid REFERENCES public.widgets(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Impressions table
CREATE TABLE IF NOT EXISTS public.impressions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  widget_id uuid REFERENCES public.widgets(id) ON DELETE CASCADE NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'widgets' AND policyname = 'Users manage own widgets') THEN
    CREATE POLICY "Users manage own widgets" ON public.widgets FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'widgets' AND policyname = 'Public can read widgets') THEN
    CREATE POLICY "Public can read widgets" ON public.widgets FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.widget_configs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'widget_configs' AND policyname = 'Users manage own widget configs') THEN
    CREATE POLICY "Users manage own widget configs" ON public.widget_configs FOR ALL USING (widget_id IN (SELECT id FROM public.widgets WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'widget_configs' AND policyname = 'Public can read widget configs') THEN
    CREATE POLICY "Public can read widget configs" ON public.widget_configs FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users manage reviews on own widgets') THEN
    CREATE POLICY "Users manage reviews on own widgets" ON public.reviews FOR ALL USING (widget_id IN (SELECT id FROM public.widgets WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Public can read reviews') THEN
    CREATE POLICY "Public can read reviews" ON public.reviews FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.impressions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'impressions' AND policyname = 'Anyone can insert impressions') THEN
    CREATE POLICY "Anyone can insert impressions" ON public.impressions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'impressions' AND policyname = 'Owners can view impressions') THEN
    CREATE POLICY "Owners can view impressions" ON public.impressions FOR SELECT USING (widget_id IN (SELECT id FROM public.widgets WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_impressions_widget_date ON public.impressions (widget_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_reviews_widget ON public.reviews (widget_id);
CREATE INDEX IF NOT EXISTS idx_widgets_user ON public.widgets (user_id);
