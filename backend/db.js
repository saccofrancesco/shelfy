import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME ?? "shelfy_db";
const client = new MongoClient(uri);

let db;

export default async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  }
  return db;
}
