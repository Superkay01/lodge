// src/app/api/transfer-payments/approve/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/app/lib/mongo';
import { ObjectId } from 'mongodb';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params; // Explicitly await params

    // Admin auth check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userRole = userDoc.exists ? (userDoc.data() as { role?: string }).role || 'student' : 'student';
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const db = await getDb();
    const _id = new ObjectId(id);
    const submission = await db.collection('payment_submissions').findOne({ _id });
    if (!submission) {
      return NextResponse.json({ error: 'Payment submission not found' }, { status: 404 });
    }

    await db
      .collection('payment_submissions')
      .updateOne({ _id }, { $set: { status: 'Approved', approvedAt: new Date() } });

    if (submission.invoiceId) {
      try {
        await db
          .collection('invoices')
          .updateOne(
            { _id: new ObjectId(submission.invoiceId) },
            { $set: { status: 'Paid', paidAt: new Date() } }
          );
      } catch (error: unknown) {
        console.error(`Failed to update invoice ${submission.invoiceId}:`, error);
      }
    }

    return NextResponse.json({ message: 'Payment approved' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to approve payment';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}