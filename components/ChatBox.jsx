"use client";

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [chatId, setChatId] = useState(null);

  console.log(messages, "messages");

  const handleSend = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };

    // Show user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    setLoading(true);
    console.log(chatId, "chatId");
    const res = await fetch("/api/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
        chatId, // ✅ important
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
   console.log(reader, "reader");
   console.log(decoder, "decoder");
    let aiText = "";

    while (true) {
      const { done, value } = await reader.read();
      console.log(value, "value",done,'done');
      if (done) break;

      const textChunk = decoder.decode(value);
      console.log(textChunk, "textChunk");

      // ✅ detect chatId
      if (textChunk.includes("__CHAT_ID__")) {
        const id = textChunk.replace("__CHAT_ID__", "");
        setChatId(id);
        continue;
      }

      aiText += textChunk;
      setMessages((prev) => {
        const updated = [...prev];
         
        if (updated[updated.length - 1]?.role === "assistant") {
          updated[updated.length - 1].content = aiText;
        } else {
          updated.push({ role: "assistant", content: aiText });
        }

        return updated;
      });
    }
    await fetchHistory();
    setLoading(false);
    setInput("");
  };

  const handleChatClick = (chat) => {
    console.log(chat,"chat")
    setMessages(chat.message); // load chat
    setChatId(chat._id); // set active chat
  };
  const fetchHistory = async () => {
    const res = await fetch("/api/chat-history");
    const data = await res.json();
    console.log(data, "data");
    setHistory(data);
  };
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex gap-2 h-full max-w-full mx-auto p-4 ">
      <div className="flex flex-3 flex-col">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="bg-gray-700 p-3 rounded-xl w-fit">🤖 Typing...</div>
          )}
        </div>
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            disabled={loading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-800 text-white"
            placeholder="Ask anything..."
          />

          <button
            type="submit"
            className="px-4 bg-blue-600 rounded"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
      <div className="flex-1">
        <div className="mb-4">
          <button
            onClick={() => {
              setMessages([]);
              setChatId(null);
            }}
          >
            New Chat
          </button>
          <h2 className="text-md text-gray-400">Previous Chats</h2>
          {history.map((chat, i) => (
            <div
              onClick={() => handleChatClick(chat)}
              key={i}
              className="text-xs text-gray-500 border-b border-solid border-white p-1"
            >
              <p className="text-lg cursor-pointer text-white capitalize">
                {chat?.message[0]?.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
