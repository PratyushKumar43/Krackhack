'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  notifications: boolean;
  theme: 'light' | 'dark';
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Subrat Malla',
    email: 'subrat@gmail.com',
    bio: 'Preserving memories, one capsule at a time.',
    notifications: true,
    theme: 'light'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof ProfileData]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setProfileData(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-memovault-salmon to-memovault-peach">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full bg-white p-2">
              <div className="w-full h-full rounded-full bg-memovault-salmon/20 flex items-center justify-center">
                <span className="text-4xl text-memovault-salmon">SM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
            <button
              onClick={() => {
                setFormData(profileData);
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2 rounded-lg bg-memovault-salmon text-white hover:bg-memovault-salmon/90 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-memovault-salmon focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-memovault-salmon focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-memovault-salmon focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={formData.notifications}
                    onChange={() => handleToggle('notifications')}
                    className="rounded border-gray-300 text-memovault-salmon focus:ring-memovault-salmon"
                  />
                  <label htmlFor="notifications" className="text-sm text-gray-700">
                    Enable notifications
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-memovault-salmon text-white rounded-lg hover:bg-memovault-salmon/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600">{profileData.bio}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Preferences</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Notifications</span>
                    <span className={profileData.notifications ? 'text-green-600' : 'text-red-600'}>
                      {profileData.notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Theme</span>
                    <span className="text-gray-900 capitalize">{profileData.theme}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-memovault-salmon">5</div>
                    <div className="text-sm text-gray-600">Total Capsules</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-memovault-salmon">2</div>
                    <div className="text-sm text-gray-600">Unlocked Capsules</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
