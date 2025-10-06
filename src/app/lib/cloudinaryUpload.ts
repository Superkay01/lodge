const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// Cloudinary uses video endpoint for both video and audio
const resourcePath = (kind: 'image'|'video'|'audio') =>
  kind === 'image' ? 'image' : 'video';

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
  // 1. Ask your Next.js API for signature
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

  // 2. Upload to Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourcePath(kind)}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('api_key', apiKey);

  const up = await fetch(url, { method: 'POST', body: form });
  if (!up.ok) throw new Error('Cloudinary upload failed');
  return up.json();
}
