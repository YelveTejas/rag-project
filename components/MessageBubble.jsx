import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 max-w-[85%] md:max-w-[75%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isUser ? "bg-blue-600" : "bg-slate-700"
        )}
      >
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-teal-400" />}
      </div>
      <div
        className={cn(
          "p-3 md:p-4 rounded-2xl flex-1 overflow-hidden",
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm shadow-md"
            : "bg-slate-800 text-slate-200 rounded-tl-sm shadow-md border border-slate-700/50"
        )}
      >
        {msg.image && (
          <div className="mb-3">
            <img src={msg.image} alt="Attached" className="max-w-full rounded-lg max-h-64 object-contain border border-white/20" />
          </div>
        )}
        <div className="text-sm md:text-base leading-relaxed break-words [&>p]:mb-4 last:[&>p]:mb-0 [&>pre]:bg-slate-900 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-3 [&>pre]:border [&>pre]:border-slate-700 [&>code]:bg-slate-900 [&>code]:text-teal-300 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>a]:text-blue-400 [&>a]:underline">
          <ReactMarkdown>{msg.content || ""}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}