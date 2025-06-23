import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // tailwind, estilos globales, etc.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);