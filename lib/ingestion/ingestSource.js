// lib/ingestion/ingestSource.js


import { scrapeURL } from "./scrapeURL.JS";
import { storeDocument } from "./storeDocument";

export async function ingestSource(source) {
  let text = "";

  if (source.type === "url") {
    text = await scrapeURL(source.value);
  }

  // future:
  // if (source.type === "youtube") {}
  // if (source.type === "github") {}

  await storeDocument(text);
}