'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const mockCapsules = [
  {
    id: '1',
    title: 'Summer Memories 2024',
    description: 'A collection of cherished moments from summer 2024.',
    unlockDate: '2025-06-01',
    status: 'locked',
    previewImage: 'https://readymadeui.com/photo.webp'
  },
  {
    id: '2',
    title: 'Birthday Wishes',
    description: 'Special messages and memories for your birthday.',
    unlockDate: '2024-12-25',
    status: 'unlocked',
    previewImage: 'https://readymadeui.com/photo.webp'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('recent');

  return (
    <div className="flex-1">
      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#FF9F87] to-[#FF7A5C] rounded-3xl p-8 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to MemoVault
            </h1>
            <p className="text-white/90 text-lg mb-6">
              Create digital time capsules to preserve your precious memories. Lock them away and
              rediscover them when the time is right.
            </p>
            <Link
              href="/capsule-vault/create"
              className="inline-block bg-white text-[#FF9F87] px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
            >
              Create Your First Capsule
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/capsule-vault/create"
              className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">✨</span>
              <span className="font-medium">Create Capsule</span>
            </Link>
            <Link
              href="/capsule-vault/dashboard"
              className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium">View Dashboard</span>
            </Link>
            <Link
              href="/capsule-vault/profile"
              className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">👤</span>
              <span className="font-medium">Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('recent')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'recent'
                  ? 'text-[#FF9F87]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Capsules
              {activeTab === 'recent' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9F87]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'upcoming'
                  ? 'text-[#FF9F87]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Unlocks
              {activeTab === 'upcoming' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9F87]" />
              )}
            </button>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCapsules
            .filter(capsule => 
              activeTab === 'recent' ? true : new Date(capsule.unlockDate) > new Date()
            )
            .map((capsule) => (
              <div
                key={capsule.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={capsule.previewImage}
                    alt="Capsule Preview"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      capsule.status === 'locked' 
                        ? 'bg-red-100 text-red-500'
                        : 'bg-green-100 text-green-500'
                    }`}>
                      {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{capsule.title}</h3>
                  <p className="text-gray-500 mb-4">{capsule.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/capsule-vault/capsule/${capsule.id}`}
                    className="block w-full text-center bg-[#FF9F87] text-white py-3 rounded-xl hover:bg-opacity-90 transition-colors"
                  >
                    {capsule.status === 'locked' ? 'View Details' : 'Open Capsule'}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
