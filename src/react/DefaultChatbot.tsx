import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHAT_STORAGE_PREFIX } from "./chatStorage";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  images?: string[]; // data URLs for previews
};

type UserContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type OpenAIMessage =
  | { role: "system"; content: string }
  | { role: "assistant"; content: string }
  | { role: "user"; content: string | UserContentPart[] };

export type DefaultChatbotProps = {
  model?: string; // OpenAI model id with vision support
  placeholderApiKey?: string; // placeholder key; user will replace
  systemPrompt?: string;
  welcome?: string;
  className?: string;
  style?: React.CSSProperties;
  conversationId?: string | null; // when null/undefined, a new id is generated per mount
  context?: unknown; // arbitrary JSON-like object passed to the model as system context
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const DefaultChatbot: React.FC<DefaultChatbotProps> = ({
  model = "gpt-4o-mini",
  placeholderApiKey = "REPLACE_WITH_YOUR_OPENAI_API_KEY",
  systemPrompt = "You are a helpful assistant.",
  welcome = "Hi! How can I help you today?",
  className,
  style,
  conversationId,
  context,
}) => {
  const generatedIdRef = useRef<string | null>(null);
  if (!conversationId && !generatedIdRef.current) {
    const gen = ((): string => {
      try {
        if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
      } catch {}
      return `conv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    })();
    generatedIdRef.current = gen;
  }
  const effectiveConversationId = conversationId ?? generatedIdRef.current!;
  const storageKey = `${CHAT_STORAGE_PREFIX}${effectiveConversationId}`;
  const [messages, setMessages] = useState<UiMessage[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as UiMessage[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [{ id: "welcome", role: "assistant", text: welcome }];
  });
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePickImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = await Promise.all(files.map(fileToDataUrl));
    setPendingImages((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const removePendingImage = (idx: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildOpenAIMessages = useCallback(
    (
      uiMessages: UiMessage[],
      nextUser?: { text: string; images: string[] }
    ): OpenAIMessage[] => {
      const result: OpenAIMessage[] = [];
      if (systemPrompt) {
        result.push({ role: "system", content: systemPrompt });
      }
      if (typeof context !== "undefined") {
        let serialized = "";
        try {
          serialized = JSON.stringify(context);
        } catch {
          serialized = String(context);
        }
        result.push({ role: "system", content: `Context: ${serialized}` });
      }
      for (const m of uiMessages) {
        if (m.role === "assistant") {
          result.push({ role: "assistant", content: m.text || "" });
        } else {
          if ((m.images?.length || 0) > 0) {
            const parts: UserContentPart[] = [
              { type: "text", text: m.text || "" },
              ...m.images!.map<UserContentPart>((url) => ({ type: "image_url", image_url: { url } })),
            ];
            result.push({ role: "user", content: parts });
          } else {
            result.push({ role: "user", content: m.text || "" });
          }
        }
      }
      if (nextUser) {
        if (nextUser.images.length > 0) {
          const parts: UserContentPart[] = [
            { type: "text", text: nextUser.text },
            ...nextUser.images.map<UserContentPart>((url) => ({ type: "image_url", image_url: { url } })),
          ];
          result.push({ role: "user", content: parts });
        } else {
          result.push({ role: "user", content: nextUser.text });
        }
      }
      console.log("result", result)
      return result;
    },
    [systemPrompt, context]
  );

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text && pendingImages.length === 0) return;
    const userMsg: UiMessage = {
      id: String(Date.now()),
      role: "user",
      text: text || undefined,
      images: pendingImages.length ? pendingImages : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingImages([]);
    setIsSending(true);

    try {
      const openaiMessages = buildOpenAIMessages(messages, {
        text: userMsg.text || "",
        images: userMsg.images || [],
      });

      const res = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${placeholderApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: openaiMessages,
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? "";
      const assistant: UiMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: typeof content === "string" ? content : String(content),
      };
      setMessages((prev) => [...prev, assistant]);
      setTimeout(scrollToEnd, 0);
    } catch (err: any) {
      const assistant: UiMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: `Error: ${err?.message || "Failed to contact OpenAI"}`,
      };
      setMessages((prev) => [...prev, assistant]);
    } finally {
      setIsSending(false);
    }
  }, [buildOpenAIMessages, input, messages, pendingImages, placeholderApiKey, model, scrollToEnd]);

  const canSend = useMemo(() => {
    return (input.trim().length > 0 || pendingImages.length > 0) && !isSending;
  }, [input, pendingImages.length, isSending]);

  // Persist conversation per conversationId
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(messages));
      }
    } catch {}
  }, [messages, storageKey]);

  // If no explicit conversationId was provided (auto-generated),
  // clear storage on unmount to avoid accumulating transient threads.
  useEffect(() => {
    return () => {
      if (!conversationId) {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(storageKey);
          }
        } catch {}
      }
    };
  }, [conversationId, storageKey]);

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", height: "100%", ...style }}>
      <div style={{ flex: 1, overflow: "auto", padding: 12, background: "#ffffff" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.06)",
                background: m.role === "user" ? "#111827" : "#f3f4f6",
                color: m.role === "user" ? "#ffffff" : "#111827",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {m.text}
              {m.images && m.images.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {m.images.map((url, i) => (
                    <img key={i} src={url} alt="upload" style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 12, borderTop: "1px solid rgba(0,0,0,0.06)", background: "#fafafa" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePickImages}
            style={{ display: "none" }}
            id="ai-hud-chatbot-file"
          />
          <label htmlFor="ai-hud-chatbot-file">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 8,
                background: "white",
                cursor: "pointer",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.5 12.5l-5 5-3-3-5 5" />
                <path d="M20 7a4 4 0 0 0-8 0v10a4 4 0 0 0 8 0Z" />
              </svg>
            </span>
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) void send();
              }
            }}
            style={{
              flex: 1,
              height: 36,
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 8,
              padding: "0 10px",
            }}
          />
          <button
            type="button"
            disabled={!canSend}
            onClick={() => void send()}
            style={{
              height: 36,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)",
              background: canSend ? "#111827" : "#e5e7eb",
              color: canSend ? "#ffffff" : "#9ca3af",
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
        </div>
        {pendingImages.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {pendingImages.map((url, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={url} alt="selected" style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }} />
                <button
                  type="button"
                  onClick={() => removePendingImage(i)}
                  aria-label="Remove image"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: 9999,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


