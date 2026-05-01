// components/InputBox.jsx

import { useState } from "react";

export default function InputBox({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        className="flex-1 p-2 rounded bg-gray-800"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <button
        disabled={loading}
        className="px-4 bg-blue-400 rounded"
      >
        Send
      </button>
    </form>
  );
}