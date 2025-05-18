import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Toaster, toast } from 'react-hot-toast'; 

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
    if (!selectedFile) {
      toast.error('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    toast.loading('Uploading and recognizing card...', { id: 'upload-toast' });

    try {
      const res = await fetch('http://localhost:8000/api/cards/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const recognizedName = data?.card?.name || "Recognition failed";
      setResult(recognizedName);

      toast.success(`Recognition complete: ${recognizedName}`, { id: 'upload-toast' });
    } catch (err) {
      console.error(err);
      setResult("Error uploading image.");
      toast.error('Failed to upload or recognize the image.', { id: 'upload-toast' });
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" /> {/* Asegúrate de poner esto una vez */}
      <div className="min-h-screen bg-[#0d1b2a] text-white px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md md:max-w-2xl bg-[#1e2a3a] p-6 md:p-10 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6 text-center">
            Upload Your Pokémon Card
          </h1>

          <p className="mb-6 text-sm md:text-base text-gray-300 text-center">
            Take a clear picture of the card to recognize it automatically.
          </p>

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-white"
            />

            {preview && (
              <div className="w-full flex justify-center">
                <img src={preview} alt="Preview" className="w-full md:w-2/3 rounded shadow-md" />
              </div>
            )}

            <button
              onClick={handleUpload}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Upload and Recognize
            </button>
          </div>

          {result && (
            <div className="mt-6 bg-white text-black px-4 py-3 rounded text-center">
              Recognized card: <strong>{result}</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadCard;


