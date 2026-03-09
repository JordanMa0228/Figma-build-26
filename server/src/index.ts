import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import usersRoutes from './routes/users';

dotenv.config();

const app = express();

// Railway dynamically assigns PORT via $PORT env var
// Must convert to Number and bind to 0.0.0.0 for Railway containers
const PORT = Number(process.env.PORT) || 8080;

// Trust Railway's reverse proxy so that express-rate-limit can correctly
// identify client IPs from the X-Forwarded-For header.
app.set('trust proxy', 1);

// CORS: allow local dev frontend + production frontend on Netlify
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://remarkable-kleicha-2265d7.netlify.app',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

// Allow all Netlify branch/preview deploys for this project
const netlifyPreviewPattern = /^https:\/\/([a-z0-9-]+--)?remarkable-kleicha-2265d7\.netlify\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow all Netlify preview/branch deploy URLs for this project
    if (netlifyPreviewPattern.test(origin)) {
      return callback(null, true);
    }
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS policy'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route — returns API info (prevents 404 on root path)
app.get('/', (_req, res) => {
  res.json({
    name: 'Focus Time API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
    },
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    port: PORT,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', usersRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// CRITICAL: bind to 0.0.0.0 for Railway — do NOT use localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Focus Time API running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Bound to: 0.0.0.0:${PORT}`);
});

export default app;
