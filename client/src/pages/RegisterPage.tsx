import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.length < 3 || name.length > 16) {
      return toast.error('Your display name must be between 3 and 16 characters.');
    }

    if (email !== confirmEmail) {
      return toast.error('Emails do not match.');
    }

    if (password.length < 8) {
      return toast.error('Password must be 8 characters or more.');
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-md mx-auto pt-28 px-4">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="mb-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in here.</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Display name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="AshKetchum"
            />
            <p className="text-xs text-gray-500">Must be between 3 and 16 characters.</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm email *</label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="you@example.com"
            />
            <p className="text-xs text-gray-500">Please enter the same email again.</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="********"
            />
            <p className="text-xs text-gray-500">Minimum of 8 characters.</p>
          </div>

          <p className="text-xs text-gray-500">
            By creating an account, you agree to the PokéTrack{' '}
            <a className="text-blue-600 hover:underline" href="#">terms of service</a> and{' '}
            <a className="text-blue-600 hover:underline" href="#">privacy policy</a>.
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


