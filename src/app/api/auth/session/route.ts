// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/app/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

const AUTH_COOKIE = process.env.SESSION_COOKIE_NAME_AUTH || 'auth';
const ROLE_COOKIE = process.env.SESSION_COOKIE_NAME_ROLE || 'role';
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 60 * 60 * 24 * 14); // 14 days

const isProd = process.env.NODE_ENV === 'production';

const allowedRoles = new Set(['student', 'landlord', 'admin']);

interface SessionRequestBody {
  idToken?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload: SessionRequestBody = await req.json().catch(() => ({}));
    const idToken = payload.idToken;
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 1) Verify ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // 2) Fetch role from Firestore (authoritative source)
    const db = getFirestore();
    const userSnap = await db.collection('users').doc(uid).get();
    let role = userSnap.exists ? (userSnap.data() as { role?: string }).role || 'student' : 'student';
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';
    const res = NextResponse.json({ error: errorMessage }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}

export async function DELETE() {
  const c = cookies();
  const opts = { httpOnly: true, sameSite: 'lax' as const, path: '/', maxAge: 0, secure: isProd };
  c.set(AUTH_COOKIE, '', opts);
  c.set(ROLE_COOKIE, '', opts);

  const res = NextResponse.json({ ok: true });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}