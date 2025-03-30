import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Aquí configuramos el proxy para redirigir las peticiones API al backend en Deno
    proxy: {
      '/api': 'http://localhost:8000', // Redirige las peticiones de la API al servidor Deno
    },
  },
});
