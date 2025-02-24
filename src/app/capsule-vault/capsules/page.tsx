'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/app/config';
import UploadMedia from '@/components/UploadMedia';
import { toast } from 'react-hot-toast';

interface Capsule {
  _id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  files: string[];
  createdAt: string;
}

export default function Capsules() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch(`${BASE_URL}/capsule`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();

        console.log('Capsules data:', result.data);
        
        if (result.success) {
          setCapsules(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch capsules');
        }
      } catch (error) {
        toast.error('Error fetching capsules');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [router]);

  const handleUploadComplete = (urls: string[]) => {
    setUploadedUrls(prev => [...prev, ...urls]);
    toast.success('Images uploaded successfully!');
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const formatDescription = (description: string) => {
    // Remove <p> tags from start and end
    return description.replace(/^<p>|<\/p>$/g, '');
  };

  const isUnlocked = (date: string) => {
    const unlockDate = new Date(date);
    const currentDate = new Date();
    return currentDate >= unlockDate;
  };

  // Filter and sort capsules
  const filteredCapsules = capsules
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
        return (a.status || '').localeCompare(b.status || '');
      }
    });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Capsule Details</h1>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Upload Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Add Photos/Videos</h2>
            <UploadMedia 
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
            />
            {uploadedUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search capsules..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Capsules Grid */}
        {loading ? (
          <div className="text-center py-8">Loading capsules...</div>
        ) : filteredCapsules.length === 0 ? (
          <div className="text-center py-8">No capsules found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <Link href={`/capsule-vault/capsule/${capsule._id}`} key={capsule._id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={capsule.files?.[0] || '/placeholder-image.jpg'}
                      alt={capsule.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-black mb-2">{capsule.title}</h3>
                    <p className="text-gray-600 mb-2">{formatDescription(capsule.description)}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        !isUnlocked(capsule.date) 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {!isUnlocked(capsule.date) ? 'Locked' : 'Unlocked'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {capsule.date ? new Date(capsule.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'No date set'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
