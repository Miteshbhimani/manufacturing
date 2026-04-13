# New Backend System - Custom TypeScript Modules

This document explains the new backend system that replaces Odoo with custom TypeScript modules.

## Overview

The new system provides:
- **Authentication**: JWT-based auth with role-based access control
- **CRM**: Lead management, contact tracking, activities
- **Sales**: Opportunity management, quote generation
- **Admin**: User management, system configuration
- **Members**: Member profiles, dashboards

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.new .env
# Edit .env with your database and email settings
```

### 3. Set Up Database
```bash
# Create PostgreSQL database
createdb nexus_engineering

# The system will automatically run migrations on startup
```

### 4. Start the Server
```bash
npm run dev:new
```

Add this script to package.json:
```json
{
  "scripts": {
    "dev:new": "ts-node src/server-new.ts",
    "start:new": "node dist/server-new.js"
  }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Health Check
- `GET /api/health` - System health status

## Database Schema

The system uses PostgreSQL with the following main tables:

### Core Tables
- `users` - User accounts and authentication
- `user_profiles` - Extended user information
- `leads` - CRM leads
- `lead_activities` - Lead activities and interactions
- `opportunities` - Sales opportunities
- `quotes` - Sales quotes and proposals
- `quote_items` - Quote line items
- `products` - Product catalog
- `email_templates` - Email templates
- `email_logs` - Email delivery logs
- `audit_logs` - System audit trail
- `system_settings` - Configuration settings

## Architecture

### Module Structure
```
src/modules/
|-- auth/                 # Authentication module
|   |-- controllers/       # API controllers
|   |-- services/          # Business logic
|   |-- models/            # Data models
|   |-- routes/            # Route definitions
|   |-- middleware/        # Auth middleware
|   `-- validators/        # Input validation
|-- crm/                  # CRM module (coming soon)
|-- sales/                # Sales module (coming soon)
|-- admin/                # Admin module (coming soon)
|-- members/              # Members module (coming soon)
`-- shared/               # Shared utilities
    |-- database/          # Database service
    |-- email/             # Email service
    |-- utils/             # Common utilities
    `-- types/             # Type definitions
```

### Key Services

#### DatabaseService
- Connection pooling
- Transaction management
- Query execution
- Health monitoring

#### EmailService
- Template-based emails
- SMTP configuration
- Delivery tracking
- Template management

#### AuthService
- JWT token management
- Password hashing
- Email verification
- Rate limiting

## Security Features

### Authentication
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Account lockout after failed attempts
- Email verification required

### Rate Limiting
- Auth endpoints: 10 requests per 15 minutes
- General API: 100 requests per 15 minutes
- Password reset: 5 requests per hour
- Email verification: 10 requests per hour

### Input Validation
- Joi schema validation
- XSS protection
- SQL injection prevention
- Input sanitization

## Configuration

### Environment Variables
- `DB_*` - Database connection settings
- `JWT_*` - JWT token configuration
- `SMTP_*` - Email server settings
- `PORT` - Server port
- `NODE_ENV` - Environment mode

### Default Admin User
Email: `admin@nexusengineering.com`
Password: `admin123`

**Important**: Change the default password after first login!

## Migration from Odoo

### Data Migration
The system includes migration scripts to transfer data from Odoo:

1. **Users**: Transfer user accounts with roles
2. **Leads**: Migrate lead data and activities
3. **Products**: Import product catalog
4. **Settings**: Transfer system configuration

### API Compatibility
The new API maintains compatibility with existing frontend code where possible, but some endpoints have been updated for better security and performance.

## Development

### Adding New Modules
1. Create module directory under `src/modules/`
2. Implement controllers, services, models
3. Add routes and middleware
4. Update module exports in `setup.ts`

### Database Migrations
1. Create SQL file in `src/migrations/`
2. Name with prefix: `001_description.sql`
3. System auto-runs on startup

### Testing
```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check
```

## Production Deployment

### Environment Setup
```bash
NODE_ENV=production
DB_SSL=true
LOG_LEVEL=warn
```

### Security Checklist
- [ ] Change default admin password
- [ ] Set strong JWT secrets
- [ ] Configure SMTP with app passwords
- [ ] Enable SSL for database
- [ ] Set up reverse proxy (nginx)
- [ ] Configure monitoring and logging

### Performance
- Database connection pooling
- Response caching
- Image optimization
- Rate limiting

## Monitoring

### Health Endpoints
- `/api/health` - System status
- `/api/cache/stats` - Cache statistics

### Logging
- Winston logger with multiple transports
- Request/response logging
- Error tracking
- Audit trail

## Troubleshooting

### Common Issues

#### Database Connection
```
Error: Database connection failed
```
Check DB_* environment variables and ensure PostgreSQL is running.

#### JWT Tokens
```
Error: Invalid token
```
Check JWT_SECRET environment variable and token expiration.

#### Email Sending
```
Error: Email send failed
```
Verify SMTP settings and use app passwords for Gmail.

### Debug Mode
```bash
DEBUG=* npm run dev:new
```

## Next Steps

1. **CRM Module**: Implement lead management
2. **Sales Module**: Add opportunity and quote management
3. **Admin Module**: User administration
4. **Members Module**: Member dashboards
5. **Frontend Integration**: Update frontend to use new APIs
6. **Testing**: Comprehensive test suite
7. **Documentation**: API documentation with Swagger

## Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Review the troubleshooting section
3. Check the health endpoint status
4. Review environment configuration
