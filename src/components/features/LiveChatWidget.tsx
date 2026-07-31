"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya Guwigo Assistant 👋 Ada yang bisa saya bantu terkait pembuatan sistem web atau aplikasi mobile untuk bisnis Anda?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = { role: "user", content: inputValue };
    const newChatHistory = [...messages, newUserMessage];

    setMessages(newChatHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newChatHistory.slice(-6) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.result },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, koneksi saya terputus. Silakan coba sebentar lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi perapih teks chat (mengubah **teks** menjadi tebal & enter baris)
  const formatChatMessage = (text: string) => {
    return text.split("\n").map((line, index) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index} className="block mb-1.5 last:mb-0">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Jendela Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header (Kaku, tidak bisa tergencet) */}
          <div className="bg-[#0B1324] p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 flex items-center justify-center border border-[#00D4FF]/30 relative">
                <Sparkles size={18} className="text-[#00D4FF]" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0B1324] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Guwigo Assistant
                </h3>
                <p className="text-xs text-[#00D4FF]">AI Support 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Area Pesan (Bisa di-scroll) */}
          <div className="flex-1 bg-slate-50 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-[#0B1324] text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                    }`}
                >
                  {formatChatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Area Footer (Tombol WA & Input - Kaku, di paling bawah) */}
          <div className="shrink-0 bg-white p-3 border-t border-slate-100 flex flex-col gap-3 z-10 relative">
            <a
              href="https://wa.me/6285179594146"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors border border-emerald-200"
            >
              <MessageCircle size={14} /> Sambungkan ke Tim Manusia
            </a>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:border-[#00D4FF] transition-colors"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pertanyaan..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 px-3 py-2"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-lg transition-colors
                  ${
                    !inputValue.trim() || isLoading
                      ? "bg-slate-200 text-slate-400"
                      : "bg-[#00D4FF] text-[#0B1324] hover:bg-blue-500 hover:text-white"
                  }`}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tombol Terapung (Floating Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0B1324] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border border-white/10"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageSquare size={24} className="text-[#00D4FF]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-[#0B1324]"></span>
          </div>
        )}
      </button>
    </div>
  );
}
