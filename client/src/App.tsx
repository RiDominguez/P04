import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import CardsPage from './pages/CardsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UploadCard from './pages/UploadCard';
import InventoryPage from './pages/Inventory'; // Asegúrate de que esta ruta sea correcta
import './index.css';

// Función para verificar si el usuario está autenticado
const useAuth = () => {
  return !!localStorage.getItem("token");
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

        {/* Otras rutas */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inventario" element={<InventoryPage />} />

        {/* Redirigir a la página principal si la ruta no existe */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
