import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ThemeManager from './Themes/ThemeManager.jsx';
import './index.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeManager>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeManager>
  </React.StrictMode>
);
