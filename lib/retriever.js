import { getEmbedding } from "./embeddings";
import { getCollection } from "./mongo";

export async function searchSimilar(query) {
  const embedding = await getEmbedding(query);
  const collection = await getCollection();

  const results = await collection.aggregate([
    {
      $vectorSearch: {
        queryVector: embedding,
        path: "embedding",
        numCandidates: 100,
        limit: 5,
        index: "default",
      },
    },
  ]).toArray();

  return results.map(r => r.text).join("\n");
}