
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI!;
let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  // Ensure the client is initialized and connected
  if (db) return db; // If db is already connected, return it
  
  // Check if client is not instantiated
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  // Check if the client is connected, connect if not
  try {
    if (!client.isConnected()) {
      await client.connect();
    }
    db = client.db(); // Default database from the URI
    return db;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Unable to connect to MongoDB');
  }
}
