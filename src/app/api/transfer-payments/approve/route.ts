import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: add admin auth check here

  const db = await getDb();
  const _id = new ObjectId(params.id);
  const submission = await db.collection("payment_submissions").findOne({ _id });
  if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await db
    .collection("payment_submissions")
    .updateOne({ _id }, { $set: { status: "Approved", approvedAt: new Date() } });

  if (submission.invoiceId) {
    try {
      await db
        .collection("invoices")
        .updateOne(
          { _id: new ObjectId(submission.invoiceId) },
          { $set: { status: "Paid", paidAt: new Date() } }
        );
    } catch {}
  }

  return NextResponse.json({ message: "Approved" });
}
