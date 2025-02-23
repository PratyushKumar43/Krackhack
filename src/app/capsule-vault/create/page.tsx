'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabaseClient';

export default function CreateCapsule() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newUploadedUrls: string[] = [];

      for (const file of files) {
        // Check file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Check file size (7MB limit)
        if (file.size > 7 * 1024 * 1024) {
          throw new Error('File size must be less than 7MB');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('Memories')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('Memories')
          .getPublicUrl(fileName);

        newUploadedUrls.push(publicUrl);
      }

      setUploadedUrls(prev => [...prev, ...newUploadedUrls]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred during upload');
    }
  };

  const removeFile = (index: number) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!title || !content || !unlockDate) {
        throw new Error('Please fill in all required fields');
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Create the capsule
      const res = await fetch(`${BASE_URL}/capsule/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: content,
          files: uploadedUrls, // Now using the Supabase URLs
          date: unlockDate
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create capsule');
      }

      toast.success('Time capsule created successfully!');
      router.push('/capsule-vault/dashboard');
    } catch (error: any) {
      console.error('Error creating capsule:', error);
      toast.error(error.message || 'Failed to create capsule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Time Capsule</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-memovault-salmon"
              placeholder="Enter capsule title"
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Photos/Videos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Drag and drop files here or click to select files
              </p>
            </div>

            {/* Preview Grid */}
            {uploadedUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlock Date */}
          <div>
            <label htmlFor="unlockDate" className="block text-sm font-medium mb-2">
              Unlock Date
            </label>
            <input
              type="date"
              id="unlockDate"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-memovault-salmon"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-memovault-salmon text-white py-3 px-6 rounded-lg hover:bg-memovault-salmon/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Time Capsule'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
