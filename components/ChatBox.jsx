"use client";

import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Send, MessageSquare, PlusCircle, Loader2, Menu, X, Bot, ImagePlus, XCircle, LogOut, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const displayName = user?.name || user?.email || "Signed in user";
  const firstName = (user?.name || user?.email?.split("@")[0] || "there").split(" ")[0];
  const userInitial = displayName.charAt(0).toUpperCase();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check size limit (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (loading || (!input.trim() && !selectedImage)) return;

    const userMsg = { role: "user", content: input, image: selectedImage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          chatId,
        }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value);

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
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "**Error:** Failed to get response. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat-history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((chat) => chat._id !== id));
      if (chatId === id) {
        startNewChat();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleChatClick = (chat) => {
    setMessages(chat.message || []);
    setChatId(chat._id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/chat-history");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const startNewChat = () => {
    setMessages([]);
    setChatId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full bg-[#0f172a] overflow-hidden text-slate-200 font-sans">
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-200/10 text-amber-200 ring-1 ring-amber-200/20">
                  <LogOut size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Sign out?</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Your chats are saved. You can come back anytime with the same account.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(false)}
                  className="h-10 flex-1 rounded-lg border border-slate-700 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="h-10 flex-1 rounded-lg bg-amber-200 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-100"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none shadow-2xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-slate-800/60 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
            <Bot className="text-blue-400" size={24} />
            Insight Stream
          </h1>
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 justify-center py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium active:scale-[0.98]"
          >
            <PlusCircle size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 mt-2">
            Recent Chats
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 px-2 italic bg-slate-800/30 p-3 rounded-lg border border-dashed border-slate-700">No previous chats.</p>
          ) : (
            history.map((chat) => (
              <button
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
                  chatId === chat._id
                    ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={16} className={cn("shrink-0", chatId === chat._id ? "text-blue-400" : "group-hover:text-slate-300")} />
                  <span className="truncate text-sm font-medium">
                    {chat?.message?.[0]?.content || "Empty Chat"}
                  </span>
                </div>
                <div 
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-all z-10 shrink-0"
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-800/60 p-4">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200">
                {userInitial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">{displayName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email || "Authenticated"}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSignOutConfirm(true)}
              className="h-9 w-9 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-gradient-to-b from-[#0f172a] to-[#0b1121]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white mr-4 transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-400" size={20} />
            Insight Stream
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-teal-300/20 bg-teal-300/10 px-4 py-3 text-teal-100 shadow-xl shadow-black/10">
                <Sparkles size={18} className="text-amber-200" />
                <span className="text-sm font-medium">Workspace ready</span>
              </div>
              <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center mb-6 shadow-xl border border-slate-700/50 ring-4 ring-slate-800/50">
                <Bot size={38} className="text-teal-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Hi {firstName}, what can I help you explore today?
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-7">
                Toss me a question, a half-formed idea, or a tricky document. I&apos;ll help turn it into something useful.
              </p>
              <div className="mt-7 grid w-full max-w-xl gap-3 sm:grid-cols-3">
                {["Summarize a topic", "Compare options", "Find the next step"].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-teal-300/40 hover:bg-slate-800 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] md:max-w-[75%] mr-auto"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-700 shadow-sm">
                <Bot size={16} className="text-teal-400" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-slate-800 text-slate-200 rounded-tl-sm shadow-md border border-slate-700/50 flex items-center gap-3">
                <Loader2 className="animate-spin text-teal-400" size={18} />
                <span className="text-sm font-medium tracking-wide">Generating response...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#0b1121] via-[#0b1121] to-transparent pt-8">
          <form
            onSubmit={handleSend}
            className="max-w-4xl mx-auto relative flex flex-col gap-2 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-slate-600 transition-all duration-300"
          >
            {selectedImage && (
              <div className="relative w-24 h-24 ml-3 mt-2 rounded-lg overflow-hidden border border-slate-600 shadow-sm">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full text-white hover:text-red-400 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="p-3 text-slate-400 hover:text-blue-400 transition-colors shrink-0 disabled:opacity-50"
              >
                <ImagePlus size={22} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect}
                accept="image/*" 
                className="hidden" 
              />
              
              <textarea
                disabled={loading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 max-h-32 min-h-[44px] p-3 bg-transparent text-white resize-none outline-none text-sm md:text-base placeholder-slate-400 scrollbar-thin scrollbar-thumb-slate-600"
                placeholder="Message Insight Stream..."
                rows={1}
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && !selectedImage)}
                className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all duration-200 shrink-0 flex items-center justify-center active:scale-95 disabled:active:scale-100"
              >
                <Send size={20} className={cn("transition-opacity", loading || (!input.trim() && !selectedImage) ? "opacity-50" : "opacity-100")} />
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-xs text-slate-500 tracking-wide">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}
