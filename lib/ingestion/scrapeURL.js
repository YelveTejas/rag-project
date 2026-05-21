// lib/ingestion/scrapeURL.js

import axios from "axios";
import { load } from "cheerio";

export async function scrapeURL(url) {
  const { data } = await axios.get(url);
  const $ = load(data);

  return $("body").text();
}
