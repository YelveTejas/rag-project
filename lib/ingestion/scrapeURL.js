// lib/ingestion/scrapeURL.js

import axios from "axios";
import cheerio from "cheerio";

export async function scrapeURL(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  return $("body").text();
}