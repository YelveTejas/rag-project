import axios from "axios";

export async function searchWeb(query) {
  const res = await axios.post("https://api.tavily.com/search", {
    api_key: process.env.TAVILY_API_KEY,
    query,
  });

  return res.data.results.map(r => r.content).join("\n");
}