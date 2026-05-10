import { Router } from 'express';
import { handleChat } from '../controllers/chatController';
import { handleIngest } from '../controllers/ingestController';

const router = Router();

// Chat endpoint (For End Users via React/Java Frontends)
router.post('/chat', handleChat);

// Ingest endpoint (For Admin Panel / Webhooks)
router.post('/ingest', handleIngest);

export default router;
