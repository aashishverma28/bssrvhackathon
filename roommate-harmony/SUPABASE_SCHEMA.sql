-- Run this in your Supabase SQL Editor to set up the database tables

-- Create Households Table
CREATE TABLE households (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  admin_id uuid REFERENCES auth.users(id),
  stability_score integer DEFAULT 75,
  stability_label text DEFAULT 'Stable',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Members Table
CREATE TABLE members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  name text NOT NULL,
  score integer DEFAULT 100,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create logs for Chores and Expenses
CREATE TABLE logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  type text NOT NULL, -- 'chore' or 'expense'
  amount numeric DEFAULT 0,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow users to see data from their own households)
-- Note: You may want to refine these based on your specific requirements
CREATE POLICY "Users can see their own households" ON households FOR SELECT USING (auth.uid() = admin_id);
CREATE POLICY "Users can insert their own households" ON households FOR INSERT WITH CHECK (auth.uid() = admin_id);

-- Create Rules Table
CREATE TABLE rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'Quiet Hours', 'Guests', 'Cleaning', etc.
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Schedules Table (Chore Calendar)
CREATE TABLE schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  title text NOT NULL,
  day_of_week text NOT NULL, -- 'Monday', etc.
  frequency text DEFAULT 'weekly',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Notifications Table
CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'info',
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Shopping List Table
CREATE TABLE shopping_list (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text,
  is_purchased boolean DEFAULT false,
  added_by text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for new tables
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Add permissive policies for hackathon speed (Authenticated users can access their household data)
CREATE POLICY "Allow authenticated users to manage rules" ON rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage schedules" ON schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage notifications" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage shopping_list" ON shopping_list FOR ALL TO authenticated USING (true) WITH CHECK (true);
