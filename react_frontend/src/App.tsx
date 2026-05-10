import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import { ChatWidget } from './components/ChatWidget';

// A simple landing page to demonstrate the widget
function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">
        Welcome to Acme Corp
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8">
        We build incredible products. Need help? Try our new AI Assistant by clicking the chat icon in the bottom right corner.
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans relative">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        {/* The floating chat widget */}
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
