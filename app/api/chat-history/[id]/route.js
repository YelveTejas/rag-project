import { auth } from "@/auth";
import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    const userId = session?.user?.email || session?.user?.id || session?.user?.sub;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const collection = await getCollection("chats");
    const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to delete chat:", error);
    return new Response(JSON.stringify({ error: "Failed to delete chat" }), { status: 500 });
  }
}
