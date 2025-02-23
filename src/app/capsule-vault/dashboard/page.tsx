'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for development - will be replaced with real API calls
const mockCapsules = [
  {
    id: '1',
    title: 'Summer Memories 2024',
    unlockDate: '2025-06-01',
    status: 'locked',
    previewImage: 'https://readymadeui.com/photo.webp'
  },
  {
    id: '2',
    title: 'Birthday Wishes',
    unlockDate: '2024-12-25',
    status: 'unlocked',
    previewImage: 'https://readymadeui.com/photo.webp'
  }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCapsules = mockCapsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || capsule.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1">
      <main className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">My Time Capsules</h1>
          <Link
            href="/capsule-vault/create"
            className="bg-[#FF9F87] text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create New Capsule
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search capsules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF9F87]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF9F87] bg-white"
          >
            <option value="all">All Capsules</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              className="bg-white rounded-2xl overflow-hidden"
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
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{capsule.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}
                </p>
                <Link
                  href={`/capsule-vault/capsule/${capsule.id}`}
                  className="block w-full text-center bg-[#FF9F87] text-white py-2.5 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {capsule.status === 'locked' ? 'View Details' : 'Open Capsule'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No capsules found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search or filter settings'
                : 'Create your first time capsule to get started!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
