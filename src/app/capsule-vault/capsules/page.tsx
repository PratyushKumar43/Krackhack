'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface Capsule {
  id: string;
  title: string;
  content: string;
  unlock_date: string;
  status: 'locked' | 'unlocked';
  images: Array<{
    url: string;
    isLocked: boolean;
  }>;
  created_at: string;
}

export default function Capsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = () => {
    try {
      // Get capsules from localStorage
      const storedCapsules = JSON.parse(localStorage.getItem('capsules') || '[]');

      // Update status based on unlock date
      const updatedCapsules = storedCapsules.map(capsule => ({
        ...capsule,
        status: new Date(capsule.unlock_date) <= new Date() ? 'unlocked' : 'locked'
      }));

      setCapsules(updatedCapsules);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      toast.error('Failed to load capsules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (capsuleId: string) => {
    try {
      const updatedCapsules = capsules.filter(capsule => capsule.id !== capsuleId);
      localStorage.setItem('capsules', JSON.stringify(updatedCapsules));
      setCapsules(updatedCapsules);
      setShowDeleteConfirm(null);
      toast.success('Capsule deleted successfully');
    } catch (error) {
      console.error('Error deleting capsule:', error);
      toast.error('Failed to delete capsule');
    }
  };

  const filteredCapsules = capsules
    .filter(capsule => {
      const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          capsule.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || capsule.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Your Time Capsules</h1>

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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-memovault-salmon mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your capsules...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-auto">
                    {capsule.images && capsule.images.length > 0 && (
                      <Image
                        src={capsule.images[0].url}
                        alt={capsule.title}
                        fill
                        className={`object-cover transition-all duration-200 ${
                          capsule.status === 'locked' && capsule.images[0].isLocked
                            ? 'filter blur-sm'
                            : ''
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-black mb-2">{capsule.title}</h2>
                        <div 
                          className="text-black/60 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: capsule.content }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          capsule.status === 'locked' 
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
                        </span>
                        {showDeleteConfirm === capsule.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(capsule.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(capsule.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete capsule"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-black/60">
                      <span>Created: {new Date(capsule.created_at).toLocaleDateString()}</span>
                      <span>Unlock Date: {new Date(capsule.unlock_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCapsules.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-2">No capsules found</h3>
                <p className="text-black/60">
                  {searchQuery 
                    ? 'Try adjusting your search or filter settings'
                    : 'Create your first time capsule to get started!'}
                </p>
                {!searchQuery && (
                  <Link 
                    href="/capsule-vault/create"
                    className="inline-block mt-4 px-6 py-2 bg-memovault-salmon text-white rounded-lg hover:bg-memovault-salmon/90 transition-colors"
                  >
                    Create Time Capsule
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
