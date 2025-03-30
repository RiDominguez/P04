import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';  // Aquí puedes incluir tus estilos si los tienes

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Esto se refiere al elemento en tu index.html
);