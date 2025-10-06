import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebaseAdmin';

export async function GET() {
  try {
    const ref = adminDb.collection('adminPing').doc('test');
    await ref.set({ ok: true, at: new Date().toISOString() }, { merge: true });
    const snap = await ref.get();
    return NextResponse.json({ data: snap.data() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
