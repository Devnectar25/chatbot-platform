// Global shim for process to fix browser errors from Node-centric libraries
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { NODE_ENV: 'production' } };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { WidgetWrapper } from './components/WidgetWrapper';
import './index.css';

console.log('✅ Homeveda Chatbot Script Initializing...');

// This script will create its own container and mount the widget
const ROOT_ID = 'homeveda-chatbot-root';

function initChatbot() {
  const container = document.getElementById(ROOT_ID);
  
  if (!container) {
    console.error(`❌ Chatbot error: Could not find element with id #${ROOT_ID}`);
    return;
  }

  // Prevent multiple renders on same element
  if ((container as any)._reactRoot) return;

  console.log('✅ Found root, mounting chatbot...');
  
  // Use absolute top-level z-index and pointer safety on the container
  container.style.position = 'fixed';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.zIndex = '2147483647';
  container.style.pointerEvents = 'none';
  
  const root = ReactDOM.createRoot(container);
  (container as any)._reactRoot = root;
  root.render(
    <React.StrictMode>
      <WidgetWrapper />
    </React.StrictMode>
  );
}

// Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initChatbot();
} else {
  window.addEventListener('DOMContentLoaded', initChatbot);
}
