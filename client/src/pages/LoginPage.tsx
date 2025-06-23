import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error logging in');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-md mx-auto pt-28 px-4">
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="mb-6 text-sm">
          Don’t have an account yet?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Create one here.</Link>
        </p>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="********"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Sign in
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

export default LoginPage;

