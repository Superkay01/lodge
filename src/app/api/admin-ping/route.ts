// src/app/api/admin-ping/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebaseAdmin';

export async function GET() {
  try {
    const ref = adminDb.collection('adminPing').doc('test');
    await ref.set({ ok: true, at: new Date().toISOString() }, { merge: true });
    const snap = await ref.get();
    return NextResponse.json({ data: snap.data() });
  } catch (e: unknown) {
    // Type narrowing to handle the error safely
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}