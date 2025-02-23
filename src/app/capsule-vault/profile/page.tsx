'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Profile() {
  const [user] = useState({
    id: 'MV123456',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://readymadeui.com/photo.webp',
    joinDate: '2024-01-01',
    capsuleStats: {
      total: 15,
      locked: 10,
      unlocked: 5,
      public: 3,
      private: 12
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex-1 bg-[#FFF5EB]">
      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Overview */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full mb-4 relative overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-[#FF9F87] mt-1">Member since {user.joinDate}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#FFF5EB] rounded-2xl p-6 text-center">
              <p className="text-4xl font-semibold text-[#FF9F87] mb-1">
                {user.capsuleStats.total}
              </p>
              <p className="text-gray-600">Total Capsules</p>
            </div>
            <div className="bg-[#FFF5EB] rounded-2xl p-6 text-center">
              <p className="text-4xl font-semibold text-[#FF9F87] mb-1">
                {user.capsuleStats.unlocked}
              </p>
              <p className="text-gray-600">Unlocked Memories</p>
            </div>
          </div>

          {/* Capsule Status */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Locked Capsules</span>
              <span>{user.capsuleStats.locked}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF9F87] to-[#FF7A5C]"
                style={{ width: `${(user.capsuleStats.locked / user.capsuleStats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[#FF9F87] text-xl">⚙️</span>
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#FF9F87] hover:text-[#FF7A5C] font-medium"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2">Display Name</label>
              <input
                type="text"
                value={user.name}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-xl bg-[#FFF5EB] border border-[#FF9F87]/20 focus:outline-none focus:ring-2 focus:ring-[#FF9F87]"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-xl bg-[#FFF5EB] border border-[#FF9F87]/20 focus:outline-none focus:ring-2 focus:ring-[#FF9F87]"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#FF9F87] text-xl">🔒</span>
            <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-[#FFF5EB] rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Public Capsules</p>
                <p className="text-sm text-gray-600">{user.capsuleStats.public} capsules visible to everyone</p>
              </div>
              <div className="text-[#FF9F87]">{user.capsuleStats.public}</div>
            </div>

            <div className="flex justify-between items-center p-4 bg-[#FFF5EB] rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Private Capsules</p>
                <p className="text-sm text-gray-600">{user.capsuleStats.private} capsules only visible to you</p>
              </div>
              <div className="text-[#FF9F87]">{user.capsuleStats.private}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
