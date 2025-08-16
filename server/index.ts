import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './lib/auth';
import { profiles } from './routes/profile.routes';
    
const app = new OpenAPIHono().basePath('/api');

// Auth routes
app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

// Mount route modules
app.route('/profile', profiles);

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Engin Hono API',
    description: 'API for the Engin Hono application',
  },
});

export type AppType = typeof app;
export default app;
