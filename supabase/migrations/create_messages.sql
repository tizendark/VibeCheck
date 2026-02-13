/*
  # Create messages table for VibeCheck Arena
  1. New Tables: messages (id, content, sentiment_score, created_at)
  2. Security: Enable RLS, allow public insert and read
*/
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sentiment_score float8 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages (public arena)
CREATE POLICY "Allow public read access" ON messages FOR SELECT USING (true);

-- Allow anyone to insert messages (anonymous chat)
CREATE POLICY "Allow public insert access" ON messages FOR INSERT WITH CHECK (true);