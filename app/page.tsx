"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Yo! I'm FRANK. Ask me anything, machan." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMsgs }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantMsg = "";
    setMessages([...newMsgs, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantMsg += decoder.decode(value);
      setMessages([...newMsgs, { role: "assistant", content: assistantMsg }]);
    }
    setLoading(false);
  }

  return (
    <main className="flex h-screen flex-col bg-[#0a0a0a]">
      <header className="flex items-center gap-3 border-b border-white/10 p-4">
        <img src="/icon-192.png" className="h-8 w-8 rounded-full" alt="FRANK" />
        <h1 className="text-xl font-semibold">FRANK CROFTON AI</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user"? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.role === "user"? "bg-white text-black" : "bg-zinc-800"}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Message FRANK..."
            className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 outline-none"
          />
          <button onClick={send} disabled={loading} className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:opacity-50">
            {loading? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
