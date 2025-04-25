import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // ajusta la ruta si es necesario

const UploadCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data.name || "Carta reconocida");
    } catch (err) {
      console.error(err);
      setResult("Error al subir la imagen");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d1b2a] text-white py-16 px-4">
        <div className="max-w-2xl mx-auto bg-[#1e2a3a] p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-orange-500 mb-6">Escanea tu carta Pokémon</h1>

          <p className="mb-4 text-sm text-gray-300">
            Sube una imagen clara de la carta. El sistema intentará identificarla automáticamente.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mb-4 text-sm text-white"
          />

          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="rounded-md w-full" />
            </div>
          )}

          <button
            onClick={handleUpload}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
          >
            Subir y reconocer
          </button>

          {result && (
            <div className="mt-6 bg-white text-black px-4 py-3 rounded shadow text-center">
              Resultado: <strong>{result}</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadCard;

