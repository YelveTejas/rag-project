import { ingestSource } from "../../../lib/ingestion/ingestSource";


export async function POST(req) {
  const body = await req.json();

  await ingestSource(body);

  return Response.json({ success: true });
}