// lib/agent.js

import { searchSimilar } from "./retriever";
import { searchWeb } from "./searchWeb";

export async function agent(query) {
  try {
    const localData = await searchSimilar(query);

    if (!localData || localData.length < 100) {
      console.log("🌐 Using Web Search");
      return await searchWeb(query);
    }

    console.log("📦 Using Local DB");
    return localData;

  } catch (error) {
    console.log("Fallback to Web");
    return await searchWeb(query);
  }
}