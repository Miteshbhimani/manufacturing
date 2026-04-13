-- @name: test_crm_simple
-- @version: 003
-- @depends: 001_create_companies_table,002_enhance_users_table

-- Create contacts table first (simple version)
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company_id INTEGER REFERENCES companies(id),
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for contacts.account_id after accounts table exists
ALTER TABLE contacts 
ADD COLUMN account_id INTEGER;

ALTER TABLE contacts 
ADD CONSTRAINT fk_contacts_account_id 
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL;
