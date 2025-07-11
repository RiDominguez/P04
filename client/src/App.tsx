import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import CardsPage from './pages/CardsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UploadCard from './pages/UploadCard';
import InventoryPage from './pages/Inventory'; // Asegúrate de que esta ruta sea correcta
import DecksPage from './components/decks';
import './index.css';
import StatsPage from './pages/statPage';
import Trade from './components/Trade';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Función para verificar si el usuario está autenticado
const useAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp > now) return true;

    // Si está expirado, eliminamos el token
    localStorage.removeItem("token");
    return false;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

// Ruta protegida: solo accesible si el usuario está autenticado
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />; // Si no está autenticado, redirige a login
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal de la aplicación */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas protegidas */}
        <Route path="/cartas" element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
        <Route path="/subir" element={<ProtectedRoute><UploadCard /></ProtectedRoute>} />
        <Route path="/deck" element={<ProtectedRoute><DecksPage /></ProtectedRoute>} />
        <Route path="/estadisticas" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        

        {/* Rutas públicas */}
        {/* Otras rutas */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inventario" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/trade" element={<ProtectedRoute><Trade /></ProtectedRoute>} />


        

        {/* Redirigir a la página principal si la ruta no existe */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
