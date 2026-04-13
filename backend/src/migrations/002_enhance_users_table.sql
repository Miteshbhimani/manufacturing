-- @name: enhance_users_table
-- @version: 002
-- @depends: 001_create_companies_table

-- Add company_id to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id);

-- Update existing users to belong to default company
UPDATE users 
SET company_id = (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)
WHERE company_id IS NULL;

-- Create indexes for user performance
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add user groups table
CREATE TABLE IF NOT EXISTS user_groups (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  company_id INTEGER REFERENCES companies(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user group memberships table
CREATE TABLE IF NOT EXISTS user_group_memberships (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES user_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, group_id)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create group permissions table
CREATE TABLE IF NOT EXISTS group_permissions (
  group_id INTEGER REFERENCES user_groups(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, permission_id)
);

-- Create indexes for permissions
CREATE INDEX IF NOT EXISTS idx_user_groups_company ON user_groups(company_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);

-- Create trigger for user_groups updated_at
CREATE OR REPLACE FUNCTION update_user_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_user_groups_updated_at
  BEFORE UPDATE ON user_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_user_groups_updated_at();

-- Insert default permissions
INSERT INTO permissions (name, description, module, action) VALUES
-- User permissions
('users.view', 'View users', 'users', 'read'),
('users.create', 'Create users', 'users', 'create'),
('users.edit', 'Edit users', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete'),
-- CRM permissions
('crm.leads.view', 'View leads', 'crm', 'read'),
('crm.leads.create', 'Create leads', 'crm', 'create'),
('crm.leads.edit', 'Edit leads', 'crm', 'update'),
('crm.leads.delete', 'Delete leads', 'crm', 'delete'),
('crm.opportunities.view', 'View opportunities', 'crm', 'read'),
('crm.opportunities.create', 'Create opportunities', 'crm', 'create'),
('crm.opportunities.edit', 'Edit opportunities', 'crm', 'update'),
('crm.opportunities.delete', 'Delete opportunities', 'crm', 'delete'),
-- Sales permissions
('sales.quotes.view', 'View quotes', 'sales', 'read'),
('sales.quotes.create', 'Create quotes', 'sales', 'create'),
('sales.quotes.edit', 'Edit quotes', 'sales', 'update'),
('sales.quotes.delete', 'Delete quotes', 'sales', 'delete'),
('sales.orders.view', 'View orders', 'sales', 'read'),
('sales.orders.create', 'Create orders', 'sales', 'create'),
('sales.orders.edit', 'Edit orders', 'sales', 'update'),
('sales.orders.delete', 'Delete orders', 'sales', 'delete'),
-- Company permissions
('company.view', 'View company', 'company', 'read'),
('company.edit', 'Edit company', 'company', 'update'),
('company.settings', 'Manage company settings', 'company', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Insert default user groups
INSERT INTO user_groups (name, description, company_id) VALUES
('Administrators', 'Full system access', (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)),
('Sales Team', 'Sales department users', (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)),
('CRM Team', 'CRM department users', (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)),
('Members', 'Basic member access', (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Assign all permissions to administrators group
INSERT INTO group_permissions (group_id, permission_id)
SELECT 
  (SELECT id FROM user_groups WHERE name = 'Administrators' AND company_id = (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)),
  id
FROM permissions
ON CONFLICT DO NOTHING;
