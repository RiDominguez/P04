import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import CardsPage from './pages/CardsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal de la aplicación */}
        <Route path="/" element={<Home />} />
        <Route path="/cartas" element={<CardsPage />} />
        <Route path="/" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;