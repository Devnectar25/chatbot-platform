import React, { useState } from 'react';
import axios from 'axios';
import { Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminPage = () => {
  const [appId, setAppId] = useState('demo_app_1');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) return;

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await axios.post('http://localhost:3000/api/ingest', {
        app_id: appId
      });
      
      setStatus({ 
        type: 'success', 
        message: response.data.data.message || 'Data ingested successfully!' 
      });
    } catch (error: any) {
      console.error(error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to ingest data. Check backend logs.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl mb-6 mx-auto">
          <Database className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-semibold text-center text-white mb-2">Data Ingestion</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Upload and vectorize data for your tenant application.
        </p>

        <form onSubmit={handleIngest} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="appId" className="block text-sm font-medium text-slate-300">
              Application ID (Tenant)
            </label>
            <input
              id="appId"
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="e.g. demo_app_1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !appId}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Trigger Vector Ingestion</span>
            )}
          </button>
        </form>

        {status.type && (
          <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
