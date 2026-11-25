"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  MessageCircle,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function LiveChatWidget() {
  const pathname = usePathname();
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

  if (pathname?.startsWith("/verify") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Jendela Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[550px] max-h-[80vh] bg-white rounded-lg shadow-2xl border border-[#E2E8F0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0A0F1D] p-4 flex items-center justify-between shrink-0 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#2563EB]/20 flex items-center justify-center border border-[#2563EB]/40 relative text-[#60A5FA]">
                <Bot size={17} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0F1D] rounded-md"></span>
              </div>
              <div>
                <h3 className="text-white font-serif text-sm font-normal">
                  Guwigo Assistant
                </h3>
                <p className="text-[11px] text-[#38BDF8]">Konsultasi Sistem 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#94A3B8] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 bg-[#FAF9F6] p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-md text-xs leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-[#2563EB] text-white rounded-tr-none shadow-sm"
                        : "bg-white text-[#0F172A] border border-[#E2E8F0] rounded-tl-none shadow-sm"
                    }`}
                >
                  {formatChatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-md rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Area Footer */}
          <div className="shrink-0 bg-white p-3 border-t border-[#E2E8F0] flex flex-col gap-2.5 z-10 relative">
            <a
              href="https://wa.me/6285179594146"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E40AF] text-xs font-medium rounded-lg transition-colors border border-[#E2E8F0]"
            >
              <MessageCircle size={14} className="text-[#2563EB]" /> Hubungkan ke Tim Engineer
            </a>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md p-1 focus-within:border-[#2563EB] transition-colors"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pertanyaan teknis..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-[#0F172A] px-3 py-2 placeholder:text-[#94A3B8]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-lg transition-colors
                  ${
                    !inputValue.trim() || isLoading
                      ? "bg-[#E2E8F0] text-[#94A3B8]"
                      : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                  }`}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tombol Terapung (Floating Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 p-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg flex items-center justify-center shadow-xl shadow-blue-500/25 hover:scale-105 transition-all border border-blue-400/30"
        aria-label="Buka Live Chat"
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <div className="relative">
            <MessageSquare size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#06B6D4] rounded-full animate-pulse border-2 border-[#2563EB]"></span>
          </div>
        )}
      </button>
    </div>
  );
}
