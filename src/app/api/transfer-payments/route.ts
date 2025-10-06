import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, amount, userId, email, proofUrl, transferRef } = body;

    if (!invoiceId || !amount || !userId || !proofUrl) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();

    // create payment submission
    const doc = {
      invoiceId,
      amount,
      userId,
      email: email ?? null,
      proofUrl,
      transferRef: transferRef ?? null,
      status: "Pending Admin Review",
      createdAt: new Date(),
    };

    const insertRes = await db.collection("payment_submissions").insertOne(doc);

    // mark invoice as pending review
    try {
      await db
        .collection("invoices")
        .updateOne({ _id: new ObjectId(invoiceId) }, { $set: { status: "Pending Admin Review" } });
    } catch {}

    return NextResponse.json({ payment: { ...doc, _id: insertRes.insertedId } }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
