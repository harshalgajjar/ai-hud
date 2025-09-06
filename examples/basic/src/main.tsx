import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ChatEnabled, DefaultChatbot, clearAllConversations, clearConversation } from "@ai-hud/chat-enabled";

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return (window as any).AI_HUD_OPENAI_API_KEY || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      (window as any).AI_HUD_OPENAI_API_KEY = apiKey || undefined;
    } catch { }
  }, [apiKey]);

  return (
    <div>
      <h1><code>&lt;ChatEnabled&gt;</code> examples</h1>
      <p>Hover the card to see the chat button. Click logs to console.</p>
      <div style={{ marginTop: 8, marginBottom: 8, display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "150px" }}>
          <h3>Key</h3>
        </div>
        <div>
          <label htmlFor="openai-key" style={{ fontSize: 14, color: "#374151" }}>OpenAI API key:</label>
          <input
            id="openai-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              minWidth: 280,
              height: 36,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "0 10px",
            }}
          />
          <button onClick={() => setApiKey("")} className="btn">Clear</button>
        </div>
      </div>
      <div style={{ marginTop: 8, marginBottom: 8, display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "150px" }}>
          <h3>Clear</h3>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => clearConversation("example-left")} className="btn">Clear "DefaultChatbot"</button>
          <button onClick={() => clearConversation("example-auto")} className="btn">Clear "DefaultChatbot with auto position"</button>
          <button onClick={() => clearConversation("example-context")} className="btn">Clear "DefaultChatbot with context"</button>
          <button onClick={() => clearConversation("example-logo")} className="btn">Clear "Visual context (as image) - text"</button>
          <button onClick={() => clearConversation("example-red")} className="btn">Clear "Visual context (as image) - plot"</button>
          <button onClick={() => clearAllConversations()} className="btn btn-danger">Clear all conversations</button>
        </div>
      </div>
      <div style={{ marginTop: 8, marginBottom: 8, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "150px" }}>
          <h2>Button</h2>
        </div>
        <div>
          <h3>Hover (default)</h3>
          <ChatEnabled onClick={() => console.log("Chat clicked (hover)")}
            position="top-right"
            offset={10}
          >
            <div className="card">Hover me</div>
          </ChatEnabled>
        </div>
        <div>
          <h3>Always visible</h3>
          <ChatEnabled trigger="always" buttonSize={44} zIndex={20}
            onClick={() => console.log("Chat clicked (always)")}
          >
            <div className="card">Always visible</div>
          </ChatEnabled>
        </div>
        <div>
          <h3>Custom button</h3>
          <ChatEnabled
            renderButton={(btn) => (
              <button {...btn} style={{ ...btn.style, background: "#111827", color: "white" }}>
                Chat
              </button>
            )}
            onClick={() => console.log("Chat clicked (custom)")}
            position="bottom-right"
          >
            <div className="card">Custom button</div>
          </ChatEnabled>
        </div>
      </div>

      <div style={{ marginTop: 8, marginBottom: 8, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "150px" }}>
          <h2>Window</h2>
        </div>
        <div>
          <h3>Floating window</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (custom JSX context)", position: "bottom-right", width: 360, height: 420, draggable: false }}
            windowContent={
              <div style={{ padding: 12 }}>
                <p style={{ margin: 0 }}>Hello! This is a floating window.</p>
                <p style={{ marginTop: 8, color: "#6b7280" }}>
                  Replace this with your chat UI.
                </p>
              </div>
            }
          >
            <div className="card">Open window</div>
          </ChatEnabled>
        </div>
        <div>
          <h3>DefaultChatbot</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (Left and draggable)", position: "bottom-left", width: 360, height: 420 }}
            windowContent={<DefaultChatbot conversationId="example-left" placeholderApiKey={apiKey} />}
          >
            <div className="card">
              <span>Open window<br />(remembers conversation)</span>
            </div>
          </ChatEnabled>
        </div>
        <div>
          <h3>DefaultChatbot with auto position</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (Auto)", position: "auto", width: 360, height: 420 }}
            windowContent={<DefaultChatbot conversationId="example-auto" placeholderApiKey={apiKey} />}
          >
            <div className="card">Open window<br />(remembers conversation)</div>
          </ChatEnabled>
        </div>
        <div>
          <h3>DefaultChatbot without conversationId</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (Closing clears conversation)", position: "auto", width: 360, height: 420 }}
            windowContent={<DefaultChatbot placeholderApiKey={apiKey} />}
          >
            <div className="card">Open window twice<br />(doesn't remember conversation)</div>

            {/* Provide DefaultChatbot explicitly via windowContent */}
          </ChatEnabled>
        </div>
      </div>

      <div style={{ marginTop: 8, marginBottom: 8, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "150px" }}>
          <h2>Context</h2>
        </div>
        <div>
          <h3>DefaultChatbot with context</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat with Context", position: "auto", width: 360, height: 420 }}
            windowContent={
              <DefaultChatbot
                conversationId="example-context"
                context={{ userId: 123, plan: "pro", features: ["analytics", "exports"], locale: "en-US" }}
                systemPrompt="You are a helpful assistant. Use the provided context when relevant."
                welcome="Ask me about what context I have."
                placeholderApiKey={apiKey}
              />
            }
          >
            <div className="card">Open window (context)
              <br /><br />
              <div>Context passed: <br /><code>userId: 123, plan: "pro", features: ["analytics", "exports"], locale: "en-US"</code></div>
            </div>
          </ChatEnabled>
        </div>
        <div>
          <h3>DefaultChatbot with visual context</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Visual context (as image)", position: "auto", width: 360, height: 420, sendComponentImageAsContext: true }}
            windowContent={<DefaultChatbot conversationId="example-red" welcome="I can see the component's content, ask me anything about it." inputValue="Which number is in red color?" placeholderApiKey={apiKey} />}
          >
            <div className="card">
              <span>
                24 and <span style={{ color: "#ef4444", fontWeight: 600 }}>18</span> are my favorite numbers.
              </span>
            </div>
          </ChatEnabled>
        </div>
        <div>
          <h3>DefaultChatbot with visual context</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Visual context (as image)", position: "auto", width: 360, height: 420, sendComponentImageAsContext: true }}
            windowContent={<DefaultChatbot conversationId="example-logo" welcome="I can see the component's content, ask me anything about it." inputValue="What is this plot about?" placeholderApiKey={apiKey} />}
          >
            {/* <div className="card"> */}
              {/* <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/206px-Wikipedia-logo-v2.svg.png?20111003033239" alt="placeholder" /> */}
              <img height={"220px"} width={"275px"} src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Price-Earnings_Ratios_as_a_Predictor_of_Twenty-Year_Returns_%28Shiller_Data%29.png/760px-Price-Earnings_Ratios_as_a_Predictor_of_Twenty-Year_Returns_%28Shiller_Data%29.png" alt="placeholder" />
            {/* </div> */}
          </ChatEnabled>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);


