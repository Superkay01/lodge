// src/app/lib/mongo.ts
import { MongoClient, Db } from 'mongodb';

let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  const db = client.db('lodgelink');
  cachedDb = db;
  return db;
}