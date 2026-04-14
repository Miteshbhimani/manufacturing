# Nucleus Metal Cast - Manufacturing Website

A modern, TypeScript-based manufacturing website with React frontend and Node.js backend, integrated with Odoo ERP system.

## Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + Odoo Integration
- **Database**: Odoo PostgreSQL
- **Authentication**: Custom auth with Odoo session management

## Features

- Product catalog with 360° image viewer
- Dynamic CMS integration with Odoo
- Lead generation and contact forms
- User authentication and role management
- Responsive design with mobile optimization
- Real-time Odoo data synchronization

## Prerequisites

- Node.js 18+ 
- PostgreSQL (for Odoo)
- Odoo 18 instance
- Redis (optional, for caching)

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd manufacturing_website/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

4. Start the frontend server:
```bash
npm run dev
```

## Environment Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Odoo Configuration
ODOO_URL=http://localhost:8069
ODOO_DB=manufacturing
ODOO_USERNAME=admin@gmail.com
ODOO_PASSWORD=admin

# Security
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend Environment Variables

```env
VITE_API_URL=/api
VITE_FRONTEND_URL=http://localhost:5173
VITE_ODOO_URL=http://localhost:8069
VITE_APP_NAME=Nucleus Metal Cast
```

## Project Structure

```
manufacturing_website/
|
|-- frontend/
|   |-- src/
|   |   |-- components/     # Reusable UI components
|   |   |-- features/       # Feature-specific components
|   |   |-- hooks/          # Custom React hooks
|   |   |-- lib/            # API clients and utilities
|   |   |-- types/          # TypeScript type definitions
|   |   |-- utils/          # Helper functions
|   |   `-- context/        # React context providers
|   `-- public/             # Static assets
|
|-- backend/
|   |-- src/
|   |   |-- controllers/    # Route controllers
|   |   |-- middleware/     # Express middleware
|   |   |-- routes/         # API routes
|   |   |-- services/       # Business logic services
|   |   |-- types/          # TypeScript types
|   |   `-- utils/          # Utility functions
|   `-- public/             # Static assets
|
`-- odoo_module/            # Custom Odoo modules
```

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login/registration
- `GET /api/auth/verify` - Email verification
- `POST /api/auth/create-odoo-session` - Create Odoo session

### Products
- `GET /api/products` - Get product catalog
- `GET /api/products/:id` - Get product details

### Leads
- `POST /api/leads` - Submit lead form

### Pages
- `GET /api/pages/:slug` - Get dynamic CMS page

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use semantic HTML and Tailwind CSS classes
- Implement proper error handling

### Component Guidelines
- Create reusable components in `/components/ui`
- Feature-specific components in `/features`
- Use proper TypeScript interfaces
- Implement loading states and error boundaries

### API Development
- Use Zod for input validation
- Implement proper error responses
- Add rate limiting and security middleware
- Document API endpoints

## Security Considerations

- Input validation with Zod schemas
- CORS configuration for production
- Rate limiting on API endpoints
- Environment variable protection
- XSS prevention with proper sanitization
- SQL injection prevention through Odoo ORM

## Performance Optimizations

- Image optimization and lazy loading
- API response caching
- Code splitting and lazy loading
- Debounced user inputs
- Optimized bundle sizes

## Deployment

### Production Build

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Set production environment variables:
```bash
NODE_ENV=production
```

3. Start production server:
```bash
cd backend
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring and Logging

- Error boundary implementation
- Console logging in development only
- Structured error responses
- Performance monitoring hooks

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use semantic versioning
5. Create pull requests with detailed descriptions

## License

[Your License Information]

## Support

For technical support, please contact:
- Email: support@nucleusmetalcast.com
- Phone: [Your Phone Number]
