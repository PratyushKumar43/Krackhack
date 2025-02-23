'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL } from '@/app/config';

// Mock data for development - will be replaced with real API calls
const mockCapsules = [
  {
    id: '1',
    title: 'Summer Memories 2024',
    description: 'A collection of beautiful moments from summer 2024',
    unlockDate: '2025-06-01',
    status: 'locked',
    previewImage: 'https://readymadeui.com/photo.webp',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Birthday Wishes',
    description: 'Special messages and photos from my 25th birthday',
    unlockDate: '2024-12-25',
    status: 'unlocked',
    previewImage: 'https://readymadeui.com/photo.webp',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    title: 'Graduation Day',
    description: 'Memories from our university graduation ceremony',
    unlockDate: '2024-05-15',
    status: 'unlocked',
    previewImage: 'https://readymadeui.com/photo.webp',
    createdAt: '2024-01-30'
  }
];

export default function Capsules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, locked, unlocked
  const [sortBy, setSortBy] = useState('date'); // date, title, status

  // Filter and sort capsules
  const filteredCapsules = mockCapsules
    .filter(capsule => {
      const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || capsule.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Capsule Details</h1>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search capsules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon bg-white"
              >
                <option value="all">All Capsules</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon bg-white"
              >
                <option value="date">Date Created</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Capsules List */}
        <div className="space-y-4">
          {filteredCapsules.map((capsule) => (
            <Link
              key={capsule.id}
              href={`/capsule-vault/capsule/${capsule.id}`}
              className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 md:h-auto">
                  <Image
                    src={capsule.previewImage}
                    alt={capsule.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-black mb-2">{capsule.title}</h2>
                      <p className="text-black/60">{capsule.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      capsule.status === 'locked' 
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-black/60">
                    <span>Created: {new Date(capsule.createdAt).toLocaleDateString()}</span>
                    <span>Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-2">No capsules found</h3>
            <p className="text-black/60">
              {searchQuery 
                ? 'Try adjusting your search or filter settings'
                : 'Create your first time capsule to get started!'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
