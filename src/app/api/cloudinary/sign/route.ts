import { NextResponse } from 'next/server';
import crypto from 'crypto';


const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

export async function POST(req: Request) {
  try {
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary env vars missing on server' },
        { status: 500 }
      );
    }

    const { folder } = await req.json();
    const timestamp = Math.floor(Date.now() / 1000);

    
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Failed to sign' },
      { status: 500 }
    );
  }
}
// cloudinaryUpload.ts (or inline in your page)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// Cloudinary uses the *video* endpoint for both video and audio.
// For images, use the image endpoint; for audio, treat as "video".
const resourcePath = (kind: 'image'|'video'|'audio') => (kind === 'image' ? 'image' : 'video');

type CLDUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: 'image'|'video'|'raw';
  duration?: number;
  width?: number;
  height?: number;
};

export async function uploadToCloudinarySigned(
  file: File,
  kind: 'image'|'video'|'audio',
  folder: string // e.g. `lodgelink/chat/${inquiryId}`
): Promise<CLDUploadResult> {
  // 1) get signature from your Next.js route
  const sigRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!sigRes.ok) {
    const e = await sigRes.json().catch(() => ({}));
    throw new Error(e?.error || 'Failed to get Cloudinary signature');
  }
  const { signature, timestamp, apiKey } = await sigRes.json();

  // 2) upload to Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourcePath(kind)}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('api_key', apiKey);

  // (optional) keep filenames readable
  // form.append('use_filename', 'true');
  // form.append('unique_filename', 'true');

  const up = await fetch(url, { method: 'POST', body: form });
  if (!up.ok) throw new Error('Cloudinary upload failed');
  return up.json();
}
