import { agent } from "@/lib/agent";
import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function POST(req) {
  try {
    const { messages, chatId } = await req.json();
    const collection = await getCollection("chats");
    const userQuery = messages[messages.length - 1].content;

    console.log("🔥 QUERY:", userQuery);

    // 🧠 RAG (retrieve context)
    const context = await agent(userQuery);
    console.log(context,'context')

    // 🧠 Prompt
    const systemPrompt = `
You are an AI research assistant.

Rules:
- Use headings (##)
- Use bullet points
- Keep clean formatting

Context:
${context}
`.trim();

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 🤖 Groq streaming
          const groqStream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userQuery },
            ],
            stream: true,
          });

          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullResponse += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // 🧠 Save to MongoDB
          const updatedMessages = [
            ...messages,
            { role: "assistant", content: fullResponse },
          ];

          let finalChatId = chatId;

          if (chatId) {
            await collection.updateOne(
              { _id: new ObjectId(chatId) },
              { $set: { message: updatedMessages, updatedAt: new Date() } }
            );
          } else {
            const res = await collection.insertOne({
              message: updatedMessages,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            finalChatId = res.insertedId.toString();
          }

          controller.enqueue(encoder.encode(`__CHAT_ID__${finalChatId}`));
          controller.close();

        } catch (streamError) {
          console.error("❌ STREAM ERROR:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return new Response("⚠️ Something went wrong. Please try again.", {
      status: 500,
    });
  }
}