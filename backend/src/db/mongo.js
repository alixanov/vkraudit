import { MongoClient } from 'mongodb';

let db = null;
let client = null;

export async function connectMongo() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('vkraudit');
  console.log('✅ MongoDB connected');
  return db;
}

export function getDb() {
  if (!db) throw new Error('MongoDB not connected');
  return db;
}
