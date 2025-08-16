import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './lib/auth';
import { Scalar } from '@scalar/hono-api-reference';
import { HonoEnv } from './types';
import { Context } from 'hono';    
import { authMiddleware } from './middlewares/auth.middleware';
const app = new OpenAPIHono<HonoEnv>()

app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

app.basePath('/api')
  .use(authMiddleware);



app.get('/scalar', Scalar({ url: '/doc' }))
app.get('/scalar', Scalar((c: Context<HonoEnv>) => {
  return {
    url: '/doc',
    proxyUrl:'https://proxy.scalar.com',
  }
}))
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})



export type AppType = typeof app;
export default app;
