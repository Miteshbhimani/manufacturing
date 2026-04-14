import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (import.meta.env.PROD) {
    // TODO: Send to error monitoring service
    event.preventDefault();
  }
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  if (import.meta.env.PROD) {
    // TODO: Send to error monitoring service
    event.preventDefault();
  }
});

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
