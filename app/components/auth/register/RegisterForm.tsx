'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

type Props = {
  setIndex: (index: number) => void;
};

export default function RegisterForm({ setIndex }: Props) {
  const router = useRouter();
  const { setUser ,setLoadingAnimation} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'staff' | 'owner' | 'guest'>('guest');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoadingAnimation(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setUser(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingAnimation(false);
    }
  };

  const handleLoginRedirect = () => {
    setIndex(0);
  };

  return (
    <div className="w-[100vw] right-0 md:w-[50vw] h-[100vh] flex items-center justify-center bg-white">
      <form
        onSubmit={handleRegister}
        className="bg-white bg-opacity-20 w-[80%] mx-auto px-8 py-12 border border-white border-opacity-30  rounded-[12px] shadow-lg  space-y-8 "
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2>

        <div className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={role}
              onChange={(e) => setRole(e.target.value as 'staff' | 'owner' | 'guest')}
              required
            >
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
              <option value="guest">Guest</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition-colors duration-200"
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="text-black underline hover:text-gray-800 transition-colors duration-200"
          >
            Log in now
          </button>
        </p>
      </form>
    </div>
  );
}
