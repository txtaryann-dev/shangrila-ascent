import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

export const ChatAssistant = () => {
  const shouldReduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Namaste! I'm Sherpa, your AI shopping assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const t = input.trim();
    setMsgs(m => [...m, { role: "user", text: t }, { role: "ai", text: "Great choice! The Aurora Pro ships same-day in Kathmandu. Would you like to view full specs?" }]);
    setInput("");
  };

  return (
    <>
      <motion.button
        initial={shouldReduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={shouldReduce ? { duration: 0 } : { delay: 1, type: "spring" }}
        whileHover={shouldReduce ? undefined : { scale: 1.06 }} whileTap={shouldReduce ? undefined : { scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Support"
        title="Chat with Support"
        className="fixed bottom-24 md:bottom-6 right-6 z-50 inline-flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-foreground text-background shadow-2xl hover:shadow-[0_0_40px_hsl(var(--accent-glow)/0.55)] transition-shadow"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline text-sm font-medium">{open ? "Close" : "Chat with Support"}</span>
        {!open && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            transition={shouldReduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-44 md:bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[380px] glass-strong rounded-3xl flex flex-col overflow-hidden h-[480px]"
          >
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center text-background">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display font-bold text-sm">Sherpa AI</div>
                <div className="text-[10px] text-muted-foreground">Online · Avg reply 12s</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "ai" ? "glass" : "ml-auto bg-foreground text-background"}`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-border/50 flex gap-2">
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 bg-transparent outline-none text-sm px-3 py-2 rounded-full glass placeholder:text-muted-foreground"
              />
              <button type="submit" className="elastic h-10 w-10 rounded-full bg-foreground text-background grid place-items-center">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
