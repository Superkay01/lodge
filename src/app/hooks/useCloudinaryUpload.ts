// hooks/useCloudinaryUpload.ts
'use client';

import { useState } from 'react';

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
  bytes: number;
  width: number;
  height: number;
};

export function useCloudinaryUpload() {
  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  async function upload(files: File[]) {
    setUploading(true);
    setProgress(0);
    try {
      const uploads: CloudinaryResponse[] = [];
      for (let i = 0; i < files.length; i++) {
        // NOTE: UNSIGNED upload — safe for client in dev/staging
        const form = new FormData();
        form.append('file', files[i]);
        form.append('upload_preset', 'lodgelink_unsigned'); // <-- your preset
        // (Optional) folder to keep assets tidy in your Cloudinary Media Library
        form.append('folder', 'lodgelink/listings');

        // Use your cloud name
        const res = await fetch('https://api.cloudinary.com/v1_1/dlksl9ydu/image/upload', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);

        const json = (await res.json()) as CloudinaryResponse;
        uploads.push(json);

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      return uploads;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600); // reset meter softly
    }
  }

  return { upload, isUploading, progress };
}
