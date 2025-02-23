'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { BASE_URL } from '@/app/config';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!agreeToTerms) {
      setError('Please agree to the Terms and Conditions');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message
      alert('Registration successful! Please login to continue.');

      // Redirect to login page after successful registration
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      alert(err.message || 'Registration failed');
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
                  Create Your Time Capsule
                </h2>
                <p className="text-black/60 mb-8">
                  Start preserving your precious memories for the future. Join MemoVault today.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
                      placeholder="Choose a username"
                    />
                  </div>
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
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
                      placeholder="Confirm your password"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4 text-memovault-salmon focus:ring-memovault-salmon border-memovault-salmon rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-black">
                      I agree to the{' '}
                      <Link href="/terms" className="text-memovault-salmon hover:text-black">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-memovault-salmon text-white py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
                {error && (
                  <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
                <p className="mt-6 text-center text-sm text-black">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-memovault-salmon hover:text-black">
                    Sign in
                  </Link>
                </p>
              </div>
              
              {/* Image Section */}
              <div className="relative hidden md:block">
                <Image
                  src="https://readymadeui.com/photo.webp"
                  alt="Signup background"
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
};

export default SignupPage;
