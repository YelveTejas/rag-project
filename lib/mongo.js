// lib/mongo.js

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let isConnected = false;

export async function getCollection() {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

   return client.db("rag_db").collection("documents");
}