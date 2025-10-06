// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/app/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // ensure Node.js, not Edge

const AUTH_COOKIE = process.env.SESSION_COOKIE_NAME_AUTH || 'auth';
const ROLE_COOKIE = process.env.SESSION_COOKIE_NAME_ROLE || 'role';
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 60 * 60 * 24 * 14); // 14 days

const isProd = process.env.NODE_ENV === 'production';

const allowedRoles = new Set(['student', 'landlord', 'admin']);

export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const idToken = payload?.idToken;
    // role from client is ignored (we read it from Firestore)
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 1) Verify ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // 2) Fetch role from Firestore (authoritative source)
    const db = getFirestore();
    const userSnap = await db.collection('users').doc(uid).get();
    let role = userSnap.exists ? (userSnap.data()?.role as string) : 'student';
    if (!allowedRoles.has(role)) role = 'student';

    // 3) Set HttpOnly cookies
    const c = cookies();
    c.set(AUTH_COOKIE, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
      secure: isProd,
    });
    c.set(ROLE_COOKIE, role, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
      secure: isProd,
    });

    const res = NextResponse.json({ ok: true, uid, role });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (e: any) {
    const res = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}

export async function DELETE() {
  // Clear cookies on logout (attrs must match those used when setting)
  const c = cookies();
  const opts = { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: isProd as boolean };
  c.set(AUTH_COOKIE, '', opts);
  c.set(ROLE_COOKIE, '', opts);

  const res = NextResponse.json({ ok: true });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
