'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabaseClient';

interface UploadMediaProps {
  onUploadComplete: (urls: string[]) => void;
  onError: (error: string) => void;
}

export default function UploadMedia({ onUploadComplete, onError }: UploadMediaProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const uploadedUrls: string[] = [];

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

        uploadedUrls.push(publicUrl);
      }

      onUploadComplete(uploadedUrls);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <div className="text-gray-600">
          {uploading ? 'Uploading...' : 'Click or drag images here to upload'}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Max file size: 7MB
        </div>
      </div>
    </div>
  );
}
