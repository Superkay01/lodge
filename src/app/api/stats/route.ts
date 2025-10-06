// app/api/stats/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch real data from a database or service (using mock data for now)
  const data = {
    listings: 100, // Example data
    propertiesSold: 300,
    views: 1000,
    users: 50,
  };

  return NextResponse.json(data);
}
