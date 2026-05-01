import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAnswer(query, context) {
  try {
    // Explicitly set the model and consider adding a generationConfig
   // Change this line
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI research assistant.

Format rules:
- Use proper headings (##)
- Use bullet points
- Keep spacing clean
- Avoid raw markdown symbols like ** in output
Context:
${context}
Question:
${query}
`;
const result = await model.generateContentStream(prompt);

    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error) {
    console.error("Streaming error:", error);

    return new Response("⚠️ Error occurred", { status: 500 });
  }
}