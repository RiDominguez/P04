import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (name.length < 3 || name.length > 16) {
      return setError('Your display name must be between 3 and 16 characters.');
    }

    if (email !== confirmEmail) {
      return setError('Emails do not match.');
    }

    if (password.length < 8) {
      return setError('Password must be 8 characters or more.');
    }

    // Simular envío
    console.log({ name, email, password });
    navigate('/'); // Puedes redirigir a otro lado tras registrar
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-xl mx-auto pt-28 px-4">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="mb-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in here.</Link>
        </p>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Display name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="text-xs text-gray-500">Your display name must be between 3 and 16 characters.</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email address confirmation *</label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="text-xs text-gray-500">Please make sure you entered your email address correctly.</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="text-xs text-gray-500">Your password must be 8 characters or more.</p>
          </div>

          <p className="text-xs text-gray-500">
            By creating an account, you agree to the PokéTrack <a className="text-blue-600 hover:underline" href="#">terms of service</a> and <a className="text-blue-600 hover:underline" href="#">privacy policy</a>.
          </p>

          <div className="flex gap-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Create my account!
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
