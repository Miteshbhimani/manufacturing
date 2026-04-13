-- @name: create_companies_table
-- @version: 001
-- @depends: 

-- Create companies table with enhanced structure for multi-company support
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  tax_id VARCHAR(50),
  currency VARCHAR(3) DEFAULT 'USD',
  fiscal_year_start DATE,
  fiscal_year_end DATE,
  parent_company_id INTEGER REFERENCES companies(id),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_uuid ON companies(uuid);
CREATE INDEX IF NOT EXISTS idx_companies_parent ON companies(parent_company_id);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_companies_updated_at();

-- Insert default company
INSERT INTO companies (name, legal_name, currency, is_active)
VALUES ('Default Company', 'Default Company Ltd', 'USD', true)
ON CONFLICT DO NOTHING;
