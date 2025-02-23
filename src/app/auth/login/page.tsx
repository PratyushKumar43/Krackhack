'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { BASE_URL } from '@/app/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }

      // Show success message
      alert('Login successful!');

      // Redirect to capsule vault
      router.push('/capsule-vault/dashboard');
    } catch (error: any) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-memovault-peach">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Form Section */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-black mb-6">
                  Sign In
                </h2>
                <p className="text-black/60 mb-8">
                  Welcome back to your digital time capsule. Unlock your cherished memories.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-memovault-salmon focus:ring-memovault-salmon border-memovault-salmon rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-black">
                        Remember me
                      </label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-memovault-salmon hover:text-black">
                      Forgot password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-memovault-salmon text-white py-3 rounded-lg hover:bg-black transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Sign In'}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-black">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-memovault-salmon hover:text-black">
                    Sign up
                  </Link>
                </p>
              </div>
              
              {/* Image Section */}
              <div className="relative hidden md:block">
                <Image
                  src="https://readymadeui.com/photo.webp"
                  alt="Login background"
                  className="object-cover"
                  fill
                  sizes="50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
