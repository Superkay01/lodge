// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const listingsSnap = await getDocs(
      query(collection(db, "listings"), where("status", "==", "active"))
    );
    const listingsCount = listingsSnap.size;

    const usersSnap = await getDocs(collection(db, "users"));
    const usersCount = usersSnap.size;

    const soldSnap = await getDocs(
      query(collection(db, "propertiesSold"), where("status", "==", "active"))
    );
    const soldCount = soldSnap.size;

    // 👇 Sum total view counts
    const viewsSnap = await getDocs(collection(db, "views"));
    let totalViews = 0;
    viewsSnap.forEach((doc) => {
      totalViews += doc.data().count || 0;
    });

    return NextResponse.json({
      listings: listingsCount,
      users: usersCount,
      propertiesSold: soldCount,
      views: totalViews,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
