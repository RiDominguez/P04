// src/pages/StatsPage.tsx
import { Dashboard } from '../components/dashboard';
import Navbar from "../components/Navbar";

const StatsPage = () => {
  // Obtén el ID del usuario autenticado (ajusta según tu sistema)
  const userId = 6; // En una app real, esto vendría de tu contexto/auth

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Estadísticas de Mi Colección</h1>
        <Dashboard userId={userId} />
      </div>
    </>
  );
};

export default StatsPage;