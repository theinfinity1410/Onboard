import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import onboardingRoutes from './routes.js';
import { errorHandler } from './middleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/onboarding', onboardingRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Error Handler
app.use(errorHandler);

// Start Server (HTTP)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});