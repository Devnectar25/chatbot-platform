import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Host the Chatbot Widget Static File
app.use(express.static(path.join(__dirname, '../../react_frontend/dist')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Node.js Multi-Tenant API Gateway (TypeScript) is running.' });
});

app.listen(PORT, () => {
    console.log(`Node.js Gateway listening on http://localhost:${PORT}`);
});
