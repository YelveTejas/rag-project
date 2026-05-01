import ReactMarkdown from "react-markdown";

export default function MessageBubble({ msg }) {
  return (
    <div
      className={`p-4 rounded-xl max-w-[75%] ${
        msg.role === "user"
          ? "bg-blue-600 ml-auto"
          : "bg-gray-800"
      }`}
    >
      <ReactMarkdown>{msg.content}</ReactMarkdown>
    </div>
  );
}