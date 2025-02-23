'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Capsule {
  id: string;
  title: string;
  content: string;
  unlock_date: string;
  status: 'locked' | 'unlocked';
  created_at: string;
  previewImage?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface DashboardStats {
  totalCapsules: number;
  lockedCapsules: number;
  unlockedCapsules: number;
  nextUnlock?: {
    title: string;
    date: string;
    daysRemaining: number;
  };
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCapsules: 0,
    lockedCapsules: 0,
    unlockedCapsules: 0
  });
  const [recentCapsules, setRecentCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      // Mocked data for demonstration
      setStats({
        totalCapsules: 5,
        lockedCapsules: 3,
        unlockedCapsules: 2,
        nextUnlock: {
          title: "Summer Memories 2024",
          date: "2025-06-01",
          daysRemaining: 98
        }
      });

      setRecentCapsules([
        {
          id: '1',
          title: 'Summer Memories 2024',
          content: 'A collection of cherished moments from summer 2024.',
          unlock_date: '2025-06-01',
          status: 'locked',
          created_at: '2024-02-23',
          previewImage: 'https://readymadeui.com/photo.webp',
          sentiment: 'positive'
        },
        {
          id: '2',
          title: 'Birthday Wishes',
          content: 'Special messages and memories for your birthday.',
          unlock_date: '2024-12-25',
          status: 'unlocked',
          created_at: '2024-02-20',
          previewImage: 'https://readymadeui.com/photo.webp',
          sentiment: 'positive'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentEmoji = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '';
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Welcome Section */}
      <motion.div 
        variants={fadeInUp}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="text-center py-12 px-8 bg-gradient-to-r from-memovault-salmon/5 to-memovault-peach/5">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Time Capsule</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preserve your precious memories and emotions, letting them mature like fine wine until the perfect moment.
          </p>
        </div>

        <div className="px-8 py-8 space-y-12">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-3xl font-bold text-memovault-salmon mb-1">{stats.totalCapsules}</div>
                <div className="text-sm text-gray-600">Total Capsules</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-3xl font-bold text-memovault-salmon mb-1">{stats.lockedCapsules}</div>
                <div className="text-sm text-gray-600">Locked Capsules</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-2">🔓</div>
                <div className="text-3xl font-bold text-memovault-salmon mb-1">{stats.unlockedCapsules}</div>
                <div className="text-sm text-gray-600">Unlocked Capsules</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/capsule-vault/create" 
              className="block bg-gradient-to-br from-white to-memovault-peach/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center space-x-6">
                <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">✨</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-memovault-salmon transition-colors">
                    Create New Capsule
                  </h3>
                  <p className="text-gray-600 mt-1">Start preserving your precious memories</p>
                </div>
              </div>
            </Link>

            <Link href="/capsule-vault/sentiment-analysis"
              className="block bg-gradient-to-br from-white to-memovault-peach/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center space-x-6">
                <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">🎭</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-memovault-salmon transition-colors">
                    Analyze Sentiment
                  </h3>
                  <p className="text-gray-600 mt-1">Understand the emotions in your memories</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Next Unlock */}
          {stats.nextUnlock && (
            <div className="bg-gradient-to-r from-white to-memovault-peach/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Next Capsule to Unlock</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-5xl animate-bounce">🎁</div>
                  <div>
                    <h3 className="text-lg font-bold text-memovault-salmon">{stats.nextUnlock.title}</h3>
                    <p className="text-gray-600 mt-1">
                      Unlocks on {new Date(stats.nextUnlock.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-memovault-salmon">{stats.nextUnlock.daysRemaining}</div>
                  <div className="text-sm text-gray-600">days remaining</div>
                </div>
              </div>
              <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-memovault-salmon to-memovault-peach"
                  style={{ 
                    width: `${100 - (stats.nextUnlock.daysRemaining / 365) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                />
              </div>
            </div>
          )}

          {/* Recent Capsules */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Capsules</h2>
              <Link href="/capsule-vault/capsules" 
                className="inline-flex items-center space-x-2 text-memovault-salmon hover:text-memovault-salmon/80 transition-colors group">
                <span>View All</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentCapsules.map((capsule) => (
                <motion.div 
                  key={capsule.id}
                  variants={fadeInUp}
                  className="group relative bg-gradient-to-br from-white to-memovault-peach/5 rounded-xl p-4 shadow hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex space-x-4">
                    {capsule.previewImage && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={capsule.previewImage}
                          alt={capsule.title}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-memovault-salmon transition-colors">
                          {capsule.title}
                        </h3>
                        {capsule.sentiment && (
                          <span className="text-lg" title={`Sentiment: ${capsule.sentiment}`}>
                            {getSentimentEmoji(capsule.sentiment)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{capsule.content}</p>
                      <div className="flex items-center mt-3 space-x-3">
                        <span className={`
                          inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                          ${capsule.status === 'locked' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'}
                        `}>
                          <span>{capsule.status === 'locked' ? '🔒' : '🔓'}</span>
                          <span>{capsule.status === 'locked' ? 'Locked' : 'Unlocked'}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(capsule.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-memovault-salmon to-memovault-peach scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
