'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { BASE_URL } from '@/app/config';

export default function CreateCapsule() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);

    // Create preview URLs for the selected files
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!title || !content || !unlockDate) {
        throw new Error('Please fill in all required fields');
      }

      // First, upload all files and get their URLs
      const fileUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file');
        }

        const { url } = await uploadRes.json();
        fileUrls.push(url);
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
          // files: fileUrls,
          date: unlockDate
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create capsule');
      }

      // Show success message
      alert('Time capsule created successfully!');
      
      // Redirect to dashboard
      router.push('/capsule-vault/dashboard');
    } catch (error: any) {
      console.error('Error creating capsule:', error);
      alert(error.message || 'Failed to create capsule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (today) and maximum date (50 years from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 50);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Create New Time Capsule</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
              placeholder="Give your capsule a memorable title"
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Memory Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Add Photos/Videos
            </label>
            <div className="border-2 border-dashed border-memovault-salmon rounded-lg p-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full"
                multiple
              />
              <p className="text-sm text-black/60 mt-2">
                Drag and drop files here or click to select files
              </p>
            </div>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlock Date */}
          <div>
            <label htmlFor="unlockDate" className="block text-sm font-medium text-black mb-2">
              Unlock Date
            </label>
            <input
              type="date"
              id="unlockDate"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-2 border border-memovault-salmon rounded-lg focus:outline-none focus:ring-2 focus:ring-memovault-salmon"
              required
            />
            <p className="text-sm text-black/60 mt-1">
              Choose when your capsule will be unlocked (up to 50 years from now)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-memovault-salmon text-memovault-salmon rounded-lg hover:bg-memovault-salmon hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-memovault-salmon text-white rounded-lg hover:bg-black transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creating...' : 'Create Capsule'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
