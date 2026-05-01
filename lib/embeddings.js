// lib/embeddings.js

import { pipeline } from "@xenova/transformers";

let embedder;

export async function getEmbedding(text) {
  try {
    if (!embedder) {
      embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }

    const result = await embedder(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(result.data);

  } catch (error) {
    console.error("Embedding error:", error);
    return [];
  }
}