/*
  # VibeCheck Arena Schema
  1. New Tables:
    - messages: Stores anonymous messages and their sentiment scores
  2. Security:
    - Enable RLS
    - Allow public insert and read (anonymous chat)
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sentiment_score float8 DEFAULT 0, -- -1 (negativo) a 1 (positivo)
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages from the last hour
CREATE POLICY "Allow public read access" ON messages
  FOR SELECT USING (created_at > now() - interval '1 hour');

-- Allow anyone to insert messages
CREATE POLICY "Allow public insert access" ON messages
  FOR INSERT WITH CHECK (true);