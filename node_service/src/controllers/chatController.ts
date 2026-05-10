import { Request, Response } from 'express';
import axios from 'axios';

export const handleChat = async (req: Request, res: Response): Promise<any> => {
    try {
        const { app_id, question, language } = req.body;

        if (!app_id || !question) {
            return res.status(400).json({ error: 'Missing required fields: app_id or question' });
        }

        const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

        console.log(`[ChatController] Forwarding query to Python for app_id: ${app_id} (Streaming)`);
        
        const response = await axios.post(`${pythonApiUrl}/chat`, {
            app_id,
            question,
            language
        }, {
            responseType: 'stream'
        });

        // Set headers for SSE (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Pipe the data directly to the client
        response.data.pipe(res);

    } catch (error: any) {
        console.error('[ChatController] Error communicating with Python API:', error.message);
        
        if (error.response) {
            return res.status(error.response.status).json({ error: 'Python AI Service Error', details: error.response.data });
        }

        return res.status(500).json({ error: 'Internal Server Error while connecting to AI Engine' });
    }
};
