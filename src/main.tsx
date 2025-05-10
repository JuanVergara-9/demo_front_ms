// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './features/auth/styles/auth.css';
import './features/categories/styles/categories.css';
import './features/reviews/styles/reviews.css';
import './features/providers/styles/reviews.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);