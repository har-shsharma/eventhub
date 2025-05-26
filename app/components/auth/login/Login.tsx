'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

type Props = {
  setIndex: (index: number) => void;
};

export default function LoginForm({ setIndex }: Props) {
  const router = useRouter();
  const { setUser, setLoadingAnimation } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoadingAnimation(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setUser(data);

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoadingAnimation(false);
    }
  };

  const handleGuestAccess = () => {
    router.push('/dashboard');
  };

  const handleSignUp = () => {
    setIndex(1);
  };

  return (
    <div className=" w-[100vw] right-0 md:w-[50vw] h-[100vh] flex items-center justify-center bg-white">
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-20 w-[80%] mx-auto px-8 py-12 border border-white border-opacity-30  rounded-[12px] shadow-lg  space-y-8 "      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        <div className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition-colors duration-200"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleGuestAccess}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Not an existing user?{' '}
          <button
            type="button"
            onClick={handleSignUp}
            className="text-black underline hover:text-gray-800 transition-colors duration-200"
          >
            Sign up now
          </button>
        </p>
      </form>
    </div>
  );
}
