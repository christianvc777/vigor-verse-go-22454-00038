-- ============================================
-- TESO Backend Complete Setup
-- Posts, XP Tracking, KPIs, Event Tracking
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. POSTS TABLE (Feed)
-- ============================================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_urls TEXT[],
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- ============================================
-- 2. POST LIKES
-- ============================================
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- ============================================
-- 3. POST COMMENTS
-- ============================================
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON public.post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.post_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);

-- ============================================
-- 4. USER XP TRACKING
-- ============================================
CREATE TABLE public.user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view XP"
  ON public.user_xp FOR SELECT
  USING (true);

CREATE POLICY "System can insert XP"
  ON public.user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update XP"
  ON public.user_xp FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_xp_user_id ON public.user_xp(user_id);
CREATE INDEX idx_user_xp_total_xp ON public.user_xp(total_xp DESC);

-- ============================================
-- 5. XP TRANSACTIONS (Activity Log)
-- ============================================
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP transactions"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert XP transactions"
  ON public.xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON public.xp_transactions(created_at DESC);

-- ============================================
-- 6. ACTIVITY EVENTS (Event Tracking for KPIs)
-- ============================================
CREATE TYPE public.event_type AS ENUM (
  'signup',
  'login',
  'post_created',
  'post_liked',
  'post_commented',
  'event_created',
  'event_joined',
  'xp_earned',
  'level_up',
  'profile_updated',
  'image_uploaded'
);

CREATE TABLE public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type public.event_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all events"
  ON public.activity_events FOR SELECT
  USING (true);

CREATE POLICY "System can insert events"
  ON public.activity_events FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_activity_events_user_id ON public.activity_events(user_id);
CREATE INDEX idx_activity_events_type ON public.activity_events(event_type);
CREATE INDEX idx_activity_events_created_at ON public.activity_events(created_at DESC);

-- ============================================
-- 7. STORAGE USAGE TRACKING
-- ============================================
CREATE TABLE public.storage_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  bucket_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own storage usage"
  ON public.storage_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert storage records"
  ON public.storage_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_storage_usage_user_id ON public.storage_usage(user_id);

-- ============================================
-- 8. FUNCTIONS - Calculate Level from XP
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE
    WHEN xp_amount >= 42000 THEN RETURN 20;
    WHEN xp_amount >= 38000 THEN RETURN 19;
    WHEN xp_amount >= 34200 THEN RETURN 18;
    WHEN xp_amount >= 30600 THEN RETURN 17;
    WHEN xp_amount >= 27200 THEN RETURN 16;
    WHEN xp_amount >= 24000 THEN RETURN 15;
    WHEN xp_amount >= 21000 THEN RETURN 14;
    WHEN xp_amount >= 18200 THEN RETURN 13;
    WHEN xp_amount >= 15600 THEN RETURN 12;
    WHEN xp_amount >= 13200 THEN RETURN 11;
    WHEN xp_amount >= 11000 THEN RETURN 10;
    WHEN xp_amount >= 9000 THEN RETURN 9;
    WHEN xp_amount >= 7200 THEN RETURN 8;
    WHEN xp_amount >= 5600 THEN RETURN 7;
    WHEN xp_amount >= 4200 THEN RETURN 6;
    WHEN xp_amount >= 3000 THEN RETURN 5;
    WHEN xp_amount >= 2000 THEN RETURN 4;
    WHEN xp_amount >= 1200 THEN RETURN 3;
    WHEN xp_amount >= 500 THEN RETURN 2;
    ELSE RETURN 1;
  END CASE;
END;
$$;

-- ============================================
-- 9. FUNCTIONS - Add XP to User
-- ============================================
CREATE OR REPLACE FUNCTION public.add_xp_to_user(
  p_user_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total INTEGER;
  v_new_level INTEGER;
  v_old_level INTEGER;
BEGIN
  -- Insert or update user_xp
  INSERT INTO public.user_xp (user_id, total_xp, current_level)
  VALUES (p_user_id, p_amount, public.calculate_level(p_amount))
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_xp = user_xp.total_xp + p_amount,
    current_level = public.calculate_level(user_xp.total_xp + p_amount),
    updated_at = now()
  RETURNING total_xp, current_level INTO v_new_total, v_new_level;

  -- Get old level
  SELECT current_level INTO v_old_level
  FROM public.user_xp
  WHERE user_id = p_user_id;

  -- Log XP transaction
  INSERT INTO public.xp_transactions (user_id, amount, action, description)
  VALUES (p_user_id, p_amount, p_action, p_description);

  -- Log activity event
  INSERT INTO public.activity_events (user_id, event_type, metadata)
  VALUES (p_user_id, 'xp_earned', jsonb_build_object('amount', p_amount, 'action', p_action));

  -- Check for level up
  IF v_new_level > v_old_level THEN
    INSERT INTO public.activity_events (user_id, event_type, metadata)
    VALUES (p_user_id, 'level_up', jsonb_build_object('new_level', v_new_level, 'old_level', v_old_level));
  END IF;
END;
$$;

-- ============================================
-- 10. TRIGGERS - Auto XP on Post Creation
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add XP for creating post
  PERFORM public.add_xp_to_user(NEW.user_id, 100, 'post_created', 'Created a new post');
  
  -- Log activity event
  INSERT INTO public.activity_events (user_id, event_type, metadata)
  VALUES (NEW.user_id, 'post_created', jsonb_build_object('post_id', NEW.id));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_created
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_post();

-- ============================================
-- 11. TRIGGERS - Auto XP on Like
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add XP for liking
  PERFORM public.add_xp_to_user(NEW.user_id, 10, 'post_liked', 'Liked a post');
  
  -- Log activity event
  INSERT INTO public.activity_events (user_id, event_type, metadata)
  VALUES (NEW.user_id, 'post_liked', jsonb_build_object('post_id', NEW.post_id));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_liked
  AFTER INSERT ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_like();

-- ============================================
-- 12. TRIGGERS - Auto XP on Comment
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add XP for commenting
  PERFORM public.add_xp_to_user(NEW.user_id, 25, 'post_commented', 'Commented on a post');
  
  -- Log activity event
  INSERT INTO public.activity_events (user_id, event_type, metadata)
  VALUES (NEW.user_id, 'post_commented', jsonb_build_object('post_id', NEW.post_id));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_commented
  AFTER INSERT ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_comment();

-- ============================================
-- 13. TRIGGERS - Track Signup Events
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Initialize user XP
  INSERT INTO public.user_xp (user_id, total_xp, current_level)
  VALUES (NEW.id, 0, 1);
  
  -- Log signup event
  INSERT INTO public.activity_events (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup', jsonb_build_object('username', NEW.username));
  
  RETURN NEW;
END;
$$;

-- Update existing trigger to include signup tracking
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_signup();

-- ============================================
-- 14. KPI VIEWS - Daily Signups
-- ============================================
CREATE OR REPLACE VIEW public.kpi_daily_signups AS
SELECT
  DATE(created_at) as signup_date,
  COUNT(*) as signups_count,
  COUNT(*) OVER (ORDER BY DATE(created_at)) as cumulative_signups
FROM public.activity_events
WHERE event_type = 'signup'
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- ============================================
-- 15. KPI VIEWS - Daily Active Users
-- ============================================
CREATE OR REPLACE VIEW public.kpi_daily_active_users AS
SELECT
  DATE(created_at) as activity_date,
  COUNT(DISTINCT user_id) as active_users
FROM public.activity_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY activity_date DESC;

-- ============================================
-- 16. KPI VIEWS - Daily Posts
-- ============================================
CREATE OR REPLACE VIEW public.kpi_daily_posts AS
SELECT
  DATE(created_at) as post_date,
  COUNT(*) as posts_count,
  COUNT(DISTINCT user_id) as unique_users_posting
FROM public.posts
GROUP BY DATE(created_at)
ORDER BY post_date DESC;

-- ============================================
-- 17. KPI VIEWS - XP Stats
-- ============================================
CREATE OR REPLACE VIEW public.kpi_xp_stats AS
SELECT
  AVG(total_xp)::INTEGER as avg_xp,
  MAX(total_xp) as max_xp,
  MIN(total_xp) as min_xp,
  current_level,
  COUNT(*) as users_at_level
FROM public.user_xp
GROUP BY current_level
ORDER BY current_level;

-- ============================================
-- 18. KPI VIEWS - Daily XP Earned
-- ============================================
CREATE OR REPLACE VIEW public.kpi_daily_xp_earned AS
SELECT
  DATE(created_at) as xp_date,
  SUM(amount) as total_xp_earned,
  COUNT(DISTINCT user_id) as users_earning_xp,
  AVG(amount)::INTEGER as avg_xp_per_transaction
FROM public.xp_transactions
GROUP BY DATE(created_at)
ORDER BY xp_date DESC;

-- ============================================
-- 19. KPI VIEWS - Storage Usage
-- ============================================
CREATE OR REPLACE VIEW public.kpi_storage_usage AS
SELECT
  DATE(created_at) as upload_date,
  COUNT(*) as files_uploaded,
  SUM(file_size) as total_bytes,
  ROUND(SUM(file_size)::NUMERIC / 1024 / 1024, 2) as total_mb,
  COUNT(DISTINCT user_id) as unique_users_uploading
FROM public.storage_usage
GROUP BY DATE(created_at)
ORDER BY upload_date DESC;

-- ============================================
-- 20. KPI VIEWS - Engagement Stats
-- ============================================
CREATE OR REPLACE VIEW public.kpi_engagement_stats AS
SELECT
  DATE(ae.created_at) as engagement_date,
  COUNT(*) FILTER (WHERE ae.event_type = 'post_liked') as total_likes,
  COUNT(*) FILTER (WHERE ae.event_type = 'post_commented') as total_comments,
  COUNT(DISTINCT ae.user_id) as active_users
FROM public.activity_events ae
WHERE ae.event_type IN ('post_liked', 'post_commented')
GROUP BY DATE(ae.created_at)
ORDER BY engagement_date DESC;

-- ============================================
-- 21. STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for post images
CREATE POLICY "Anyone can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own post images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 22. SEED DATA
-- ============================================

-- Function to create seed data
CREATE OR REPLACE FUNCTION public.create_seed_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_demo_user_id UUID;
BEGIN
  -- Get or create demo user (will use actual signed-up user)
  -- This is just placeholder - real data comes from actual usage
  
  -- Seed some demo events for testing
  -- Note: Real posts will be created by actual users
  NULL;
END;
$$;