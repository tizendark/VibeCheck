/*
  # Create messages table for VibeCheck Arena
  1. New Tables: messages (id, content, sentiment_score, created_at)
  2. Security: Enable RLS, allow anonymous inserts and reads
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sentiment_score float8 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquiera lea los mensajes (Anónimo)
CREATE POLICY "Allow public read access" ON messages
  FOR SELECT USING (true);

-- Permitir que cualquiera inserte mensajes (Anónimo)
CREATE POLICY "Allow public insert access" ON messages
  FOR INSERT WITH CHECK (true);

-- Habilitar Realtime para esta tabla
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
