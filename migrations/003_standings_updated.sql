-- Add standings_updated flag to matches table (幂等防重复)
ALTER TABLE matches ADD COLUMN standings_updated INTEGER DEFAULT 0;
