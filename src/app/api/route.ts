import { NextResponse } from 'next/server';
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@farm-fresh.cx8s3uq.mongodb.net/`;

// Create cached connection variable
let cachedDb: any = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri: string) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = await client.db('farm-fresh');

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

export async function GET(request: Request) {
  // Get a database connection, cached or otherwise
  const db = await connectToDatabase(uri);
  // const collection = await db.collection('farms');
  const collection = await db.collection('Farm');

  const farms = await collection.find({}).toArray();
  return NextResponse.json({ farms });
}
