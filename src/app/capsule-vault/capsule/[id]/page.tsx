'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Capsule {
  _id: string;
  title: string;
  description: string;
  date: string;
  files: string[];
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

export default function CapsuleDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch(`${BASE_URL}/capsule/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (result.success) {
          setCapsule(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch capsule');
          if (response.status === 404) {
            router.push('/capsule-vault/capsules');
          }
        }
      } catch (error) {
        toast.error('Error fetching capsule');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [params.id, router]);

  const formatDescription = (description: string) => {
    return description.replace(/^<p>|<\/p>$/g, '');
  };

  const isUnlocked = (date: string) => {
    const unlockDate = new Date(date);
    const currentDate = new Date();
    return currentDate >= unlockDate;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading capsule details...</div>
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Capsule not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{capsule.title}</h1>
              <p className="text-gray-600">Created by {capsule.user.username}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm ${
              !isUnlocked(capsule.date)
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}>
              {!isUnlocked(capsule.date) ? 'Locked' : 'Unlocked'}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700">{formatDescription(capsule.description)}</p>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Unlock Date: {new Date(capsule.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Images Grid */}
        {capsule.files && capsule.files.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capsule.files.map((file, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={file}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push('/capsule-vault/capsules')}
          className="mt-8 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Capsules
        </button>
      </div>
    </div>
  );
}
