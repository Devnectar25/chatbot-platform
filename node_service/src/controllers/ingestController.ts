import { Request, Response } from 'express';
import axios from 'axios';

export const handleIngest = async (req: Request, res: Response): Promise<any> => {
    try {
        const { app_id } = req.body;

        if (!app_id) {
            return res.status(400).json({ error: 'Missing required field: app_id' });
        }

        const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

        console.log(`[IngestController] Forwarding ingest command to Python for app_id: ${app_id}`);

        const response = await axios.post(`${pythonApiUrl}/ingest`, {
            app_id
        });

        return res.json({
            status: 'success',
            data: response.data
        });

    } catch (error: any) {
        console.error('[IngestController] Error communicating with Python API:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({ error: 'Python AI Service Error', details: error.response.data });
        }

        return res.status(500).json({ error: 'Internal Server Error while connecting to AI Engine' });
    }
};
