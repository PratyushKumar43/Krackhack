'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

// Mock data - will be replaced with API call
const mockCapsule = {
  id: '1',
  title: 'Summer Memories 2024',
  content: `<h2>My Amazing Summer</h2>
    <p>This summer was filled with incredible moments and unforgettable memories...</p>
    <ul>
      <li>Beach trip with friends</li>
      <li>Mountain hiking adventure</li>
      <li>Family barbecue</li>
    </ul>`,
  unlockDate: '2025-06-01',
  status: 'locked',
  createdAt: '2024-01-15',
  images: [
    'https://readymadeui.com/photo.webp',
    'https://readymadeui.com/photo.webp'
  ],
  owner: {
    name: 'John Doe',
    email: 'john@example.com'
  }
};

export default function CapsuleDetails() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [capsule, setCapsule] = useState(mockCapsule);
  const [timeUntilUnlock, setTimeUntilUnlock] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCapsule(mockCapsule);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (capsule.status === 'locked') {
      const interval = setInterval(() => {
        const now = new Date();
        const unlockDate = new Date(capsule.unlockDate);
        const diff = unlockDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeUntilUnlock('Unlocked!');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeUntilUnlock(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [capsule.status, capsule.unlockDate]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-memovault-salmon/20 rounded w-1/3"></div>
            <div className="h-4 bg-memovault-salmon/20 rounded w-1/4"></div>
            <div className="h-64 bg-memovault-salmon/20 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{capsule.title}</h1>
          <p className="text-black/60">
            Created on {new Date(capsule.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status Banner */}
        {capsule.status === 'locked' && (
          <div className="bg-memovault-salmon/10 border border-memovault-salmon rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-2">Time Until Unlock</h2>
            <div className="text-3xl font-bold text-memovault-salmon">
              {timeUntilUnlock}
            </div>
          </div>
        )}

        {/* Content */}
        {capsule.status === 'unlocked' ? (
          <div className="space-y-8">
            {/* Text Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: capsule.content }}
              />
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capsule.images.map((image, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Memory ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-black mb-4">
              This capsule is still locked
            </h2>
            <p className="text-black/60">
              Return on {new Date(capsule.unlockDate).toLocaleDateString()} to view its contents
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-memovault-salmon text-memovault-salmon rounded-lg hover:bg-memovault-salmon hover:text-white transition-colors"
          >
            Back
          </button>
          {capsule.status === 'unlocked' && (
            <button
              onClick={() => {/* TODO: Implement share functionality */}}
              className="px-6 py-2 bg-memovault-salmon text-white rounded-lg hover:bg-black transition-colors"
            >
              Share
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
