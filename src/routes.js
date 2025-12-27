import express from 'express';
import { completeOnboarding } from './controllers.js';

const router = express.Router();

router.post('/complete', completeOnboarding);

export default router;
