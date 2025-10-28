-- Create user_metrics table for individual user metrics
CREATE TABLE IF NOT EXISTS public.user_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  calories_burned_today INTEGER DEFAULT 0,
  steps_today INTEGER DEFAULT 0,
  workouts_this_week INTEGER DEFAULT 0,
  workouts_this_month INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  heart_rate_avg INTEGER,
  sleep_hours DECIMAL(3,1),
  water_intake_ml INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_metrics
CREATE POLICY "Users can view their own metrics"
  ON public.user_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
  ON public.user_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
  ON public.user_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Create marketplace_posts table
CREATE TABLE IF NOT EXISTS public.marketplace_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'COP',
  category TEXT NOT NULL,
  condition TEXT,
  whatsapp_number TEXT NOT NULL,
  is_service BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_posts
CREATE POLICY "Anyone can view marketplace posts"
  ON public.marketplace_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create marketplace posts"
  ON public.marketplace_posts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = marketplace_posts.post_id 
    AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own marketplace posts"
  ON public.marketplace_posts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = marketplace_posts.post_id 
    AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own marketplace posts"
  ON public.marketplace_posts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = marketplace_posts.post_id 
    AND posts.user_id = auth.uid()
  ));

-- Create gyms/places table
CREATE TABLE IF NOT EXISTS public.places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  phone TEXT,
  website TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- RLS Policies for places
CREATE POLICY "Anyone can view places"
  ON public.places FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON public.places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own places"
  ON public.places FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own places"
  ON public.places FOR DELETE
  USING (auth.uid() = user_id);

-- Create wearable_data table
CREATE TABLE IF NOT EXISTS public.wearable_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL,
  steps INTEGER,
  distance_km DECIMAL(6,2),
  calories_burned INTEGER,
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  heart_rate_min INTEGER,
  active_minutes INTEGER,
  sleep_hours DECIMAL(3,1),
  sync_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, sync_date)
);

-- Enable RLS
ALTER TABLE public.wearable_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wearable_data
CREATE POLICY "Users can view their own wearable data"
  ON public.wearable_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wearable data"
  ON public.wearable_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wearable data"
  ON public.wearable_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  unit TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  xp_reward INTEGER DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policy for challenges
CREATE POLICY "Anyone can view challenges"
  ON public.challenges FOR SELECT
  USING (true);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_challenges
CREATE POLICY "Users can view their own challenges"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges"
  ON public.user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress"
  ON public.user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update user metrics from wearable data
CREATE OR REPLACE FUNCTION public.sync_wearable_to_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_metrics (
    user_id,
    steps_today,
    calories_burned_today,
    heart_rate_avg,
    sleep_hours
  )
  VALUES (
    NEW.user_id,
    NEW.steps,
    NEW.calories_burned,
    NEW.heart_rate_avg,
    NEW.sleep_hours
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    steps_today = NEW.steps,
    calories_burned_today = NEW.calories_burned,
    heart_rate_avg = NEW.heart_rate_avg,
    sleep_hours = NEW.sleep_hours,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger for wearable sync
CREATE TRIGGER on_wearable_sync
  AFTER INSERT OR UPDATE ON public.wearable_data
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_wearable_to_metrics();

-- Insert sample challenges
INSERT INTO public.challenges (title, description, challenge_type, target_value, unit, duration_days, start_date, end_date, xp_reward)
VALUES 
  ('10K Steps Daily', 'Camina 10,000 pasos cada día durante una semana', 'steps', 10000, 'pasos', 7, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 500),
  ('Burn 3000 Calories', 'Quema 3000 calorías esta semana', 'calories', 3000, 'calorías', 7, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 750),
  ('5 Workouts This Week', 'Completa 5 entrenamientos esta semana', 'workouts', 5, 'entrenamientos', 7, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 600),
  ('30-Day Streak', 'Entrena 30 días seguidos', 'streak', 30, 'días', 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 2000)
ON CONFLICT DO NOTHING;