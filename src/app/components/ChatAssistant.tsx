"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi${profile.full_name ? ` ${profile.full_name.split(" ")[0]}` : ""}! 👋 I'm your LYO-AI career assistant. I can help you with:

- Finding jobs and learnerships
- Improving your CV
- Interview preparation
- Career advice for South Africa
- Explaining your employability score

What can I help you with today?`,
      }]);
    }
  }, [open, profile]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (p) setProfile(p);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          profile,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.reply,
      }]);

    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Find me learnerships in my area",
    "How can I improve my CV?",
    "What jobs match my skills?",
    "Help me prepare for an interview",
  ];

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-32px)] md:w-96 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">

          {/* Header */}
          <div className="bg-[#111827] border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-400/20 border border-blue-400/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">LYO-AI Assistant</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition p-1"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-[#111827] border border-white/10 text-slate-300 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#111827] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs bg-white/5 border border-white/10 text-slate-400 px-3 py-1.5 rounded-full hover:border-blue-400/30 hover:text-blue-400 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 p-3 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              rows={1}
              className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition resize-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-400 text-[#0a0f1e] p-2.5 rounded-xl hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            </button>
          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 bg-blue-400 text-[#0a0f1e] rounded-full shadow-lg hover:bg-blue-300 transition flex items-center justify-center animate-pulse-glow"
      >
        {open ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}