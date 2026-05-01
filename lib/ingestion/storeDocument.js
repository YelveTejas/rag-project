// lib/ingestion/storeDocument.js

import { getCollection } from "../mongo";
import { getEmbedding } from "../embeddings";

export async function storeDocument(text) {
  try {
    const chunks = text.match(/.{1,500}/g) || [];

    const collection = await getCollection();

    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      await collection.insertOne({
        text: chunk,
        embedding, // ✅ THIS LINE GOES HERE
      });
    }

    console.log("✅ Document stored successfully");

  } catch (error) {
    console.error("❌ storeDocument error:", error);
  }
}