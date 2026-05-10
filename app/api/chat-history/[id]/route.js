import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const collection = await getCollection("chats");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to delete chat:", error);
    return new Response(JSON.stringify({ error: "Failed to delete chat" }), { status: 500 });
  }
}
