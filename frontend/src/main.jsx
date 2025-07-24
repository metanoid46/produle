import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ThemeManager from './Themes/ThemeManager.jsx';
import { App as AntdApp} from 'antd';
import './index.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeManager>
      <BrowserRouter>
      <AntdApp>
        <App />
      </AntdApp>
      </BrowserRouter>
    </ThemeManager>
  </React.StrictMode>
);
