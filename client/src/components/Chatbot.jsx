import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiCpu } from "react-icons/fi";
import { sendChatMessage } from "../services/chatService";

export default function Chatbot({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm the GeoMiner AI Assistant. Ask me about predictions, geological terms, or how drill sites are ranked." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const { reply } = await sendChatMessage(text, context);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn't reach the AI service just now. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[min(360px,90vw)] h-[480px] glass-card flex flex-col z-50 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border bg-primary-600/10">
              <FiCpu className="text-primary-400" />
              <p className="text-sm font-semibold text-slate-100">GeoMiner AI Assistant</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary-600 text-white rounded-br-sm"
                        : "bg-surface-200 text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && <p className="text-xs text-slate-500">Thinking…</p>}
            </div>

            <div className="p-3 border-t border-surface-border flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about this prediction…"
                className="input-field !py-2 text-sm"
              />
              <button onClick={send} className="btn-primary !px-3 !py-2" aria-label="Send">
                <FiSend size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-glow flex items-center justify-center text-white z-50 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open AI assistant"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </>
  );
}
