export const CHAT_STORAGE_PREFIX = "ai-hud:default-chatbot:history:";

export function getConversationStorageKey(conversationId: string): string {
  return `${CHAT_STORAGE_PREFIX}${conversationId}`;
}

export function clearConversation(conversationId: string): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getConversationStorageKey(conversationId));
    }
  } catch {}
}

export function clearAllConversations(): void {
  try {
    if (typeof window === "undefined") return;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(CHAT_STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {}
}


