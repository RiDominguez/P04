import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente App
import './app.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);