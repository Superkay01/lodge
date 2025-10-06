// src/app/api/cloudinary/sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

interface SignRequestBody {
  folder?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary env vars missing on server' },
        { status: 500 }
      );
    }

    const { folder }: SignRequestBody = await req.json();
    const timestamp = Math.floor(Date.now() / 1000);

    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}