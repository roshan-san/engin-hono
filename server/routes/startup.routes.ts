import { Hono } from 'hono';
import { HonoEnv } from '../types';
import { authMiddleware } from '../middlewares/auth.middleware';
import { 
  getStartups, 
  getStartupById, 
  createStartup, 
  updateStartup, 
  deleteStartup,
  searchStartups
} from '../handlers/startup.handlers';

export const startups = new Hono<HonoEnv>()
  .use(authMiddleware);

// GET /startups - Get all startups (with optional search)
startups.get('/', getStartups);

// GET /startups/search - Search startups with filters
startups.get('/search', searchStartups);

// GET /startups/:id - Get startup by ID
startups.get('/:id', getStartupById);

// POST /startups - Create a new startup
startups.post('/', createStartup);

// PUT /startups/:id - Update a startup
startups.put('/:id', updateStartup);

// DELETE /startups/:id - Delete a startup
startups.delete('/:id', deleteStartup);

