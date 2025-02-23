'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { toast } from 'react-hot-toast';

// Mock storage for capsules (this would normally be in a database)
let mockCapsules = [];

export default function CreateCapsule() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    isLocked: boolean;
    file: File;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newUploadedFiles = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        if (file.size > 7 * 1024 * 1024) {
          throw new Error('File size must be less than 7MB');
        }

        // Create a local URL for the file
        const url = URL.createObjectURL(file);

        newUploadedFiles.push({
          url,
          isLocked: false,
          file
        });
      }

      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred during upload');
    }
  };

  const toggleLock = (index: number) => {
    setUploadedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, isLocked: !item.isLocked } : item
    ));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Cleanup object URLs to prevent memory leaks
      URL.revokeObjectURL(prev[index].url);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!title || !content || !unlockDate) {
        throw new Error('Please fill in all required fields');
      }

      // Create a new mock capsule
      const newCapsule = {
        id: Date.now().toString(),
        title,
        content,
        unlock_date: unlockDate,
        images: uploadedFiles.map(file => ({
          url: file.url,
          isLocked: file.isLocked
        })),
        created_at: new Date().toISOString(),
        status: 'locked'
      };

      // Store in localStorage for persistence
      const existingCapsules = JSON.parse(localStorage.getItem('capsules') || '[]');
      localStorage.setItem('capsules', JSON.stringify([...existingCapsules, newCapsule]));

      toast.success('Time capsule created successfully!');
      router.push('/capsule-vault/capsules');
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Add Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-memovault-salmon/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Drag and drop images here or click to select files
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={item.url}
                        alt={`Uploaded image ${index + 1}`}
                        fill
                        className={`object-cover rounded-lg transition-all duration-200 ${
                          item.isLocked ? 'filter blur-sm' : ''
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => toggleLock(index)}
                        className={`${
                          item.isLocked ? 'bg-red-500' : 'bg-green-500'
                        } text-white rounded-full p-2 hover:scale-110 transition-transform`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          {item.isLocked ? (
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          ) : (
                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                          )}
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="bg-red-500 text-white rounded-full p-2 hover:scale-110 transition-transform"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-memovault-salmon hover:bg-memovault-salmon/90'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Time Capsule'}
          </button>
        </form>
      </div>
    </main>
  );
}
