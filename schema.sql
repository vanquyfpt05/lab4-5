-- Supabase SQL Script to create the `orders` table
-- Run this in the Supabase SQL Editor

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  total_price numeric NOT NULL,
  items jsonb NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security) safely if needed:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only see their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
