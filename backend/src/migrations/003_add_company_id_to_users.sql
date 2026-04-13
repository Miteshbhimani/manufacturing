-- Add company_id column to users table for multi‑company support
ALTER TABLE users
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL;

-- Optional: set a default company for existing users (e.g., company with id = 1)
UPDATE users SET company_id = 1 WHERE company_id IS NULL;