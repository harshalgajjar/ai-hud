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
    <div className="container">
      <h1 className="mb-2"><code>&lt;ChatEnabled&gt;</code> examples</h1>
      <p className="text-muted">Chat with any/all components</p>
      <div className="row gy-3 align-items-start mb-3">
        <div className="col-12 col-md-2">
          <h3>Key</h3>
        </div>
        <div className="col-12 col-md">
          <label htmlFor="openai-key" style={{ fontSize: 14, color: "#374151" }}>OpenAI API key:</label>
          <input
            id="openai-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="form-control d-inline-block" style={{ maxWidth: 360 }}
          />
          <button onClick={() => setApiKey("")} className="btn btn-outline-secondary ms-2">Clear</button>
        </div>
      </div>
      <div className="row gy-2 align-items-start mb-3">
        <div className="col-12 col-md-2">
          <h3>Clear Conversations</h3>
        </div>
        <div className="col-12 col-md">
          <div className="d-flex flex-wrap gap-2">
            <button onClick={() => clearConversation("example-left")} className="btn btn-outline-secondary">Clear "DefaultChatbot"</button>
            <button onClick={() => clearConversation("example-auto")} className="btn btn-outline-secondary">Clear "DefaultChatbot with auto position"</button>
            <button onClick={() => clearConversation("example-context")} className="btn btn-outline-secondary">Clear "DefaultChatbot with context"</button>
            <button onClick={() => clearConversation("example-logo")} className="btn btn-outline-secondary">Clear "Visual context (as image) - text"</button>
            <button onClick={() => clearConversation("example-red")} className="btn btn-outline-secondary">Clear "Visual context (as image) - plot"</button>
            <button onClick={() => clearAllConversations()} className="btn btn-danger">Clear all</button>
          </div>
        </div>
      </div>
      <div className="row gy-3 align-items-start mb-3">
        <div className="col-12 col-md-2">
          <h2>Button</h2>
        </div>
        <div className="col-12 col-md">
          <div className="d-flex flex-row flex-wrap gap-3">
            <div className="example-container">
              <h3>Hover (default)</h3>
              <ChatEnabled onClick={() => console.log("Chat clicked (hover)")}
                position="top-right"
                offset={10}
              >
                <div className="card">Hover me</div>
              </ChatEnabled>
            </div>
            <div className="example-container">
              <h3>Always visible</h3>
              <ChatEnabled trigger="always" buttonSize={44} zIndex={20}
                onClick={() => console.log("Chat clicked (always)")}
              >
                <div className="card">Always visible</div>
              </ChatEnabled>
            </div>
            <div className="example-container">
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
        </div>
      </div>

      <div className="row gy-3 align-items-start mb-3">
        <div className="col-12 col-md-2"><h2>Window</h2></div>
        <div className="col-12 col-md">
          <div className="d-flex flex-row flex-wrap gap-3">
            <div className="example-container">
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
            <div className="example-container">
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
            <div className="example-container">
              <h3>DefaultChatbot with auto position</h3>
              <ChatEnabled
                openWindowOnClick
                windowProps={{ title: "Chat (Auto)", position: "auto", width: 360, height: 420 }}
                windowContent={<DefaultChatbot conversationId="example-auto" placeholderApiKey={apiKey} />}
              >
                <div className="card">Open window<br />(remembers conversation)</div>
              </ChatEnabled>
            </div>
            <div className="example-container">
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
        </div>
      </div>

      <div className="row gy-3 align-items-start mb-3">
        <div className="col-12 col-md-2"><h2>Context</h2></div>
        <div className="col-12 col-md">
          <div className="d-flex flex-row flex-wrap gap-3">
            <div className="example-container">
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
            <div className="example-container">
              <h3>DefaultChatbot with visual context</h3>
              <ChatEnabled
                openWindowOnClick
                position="top-left"
                windowProps={{ title: "Visual context (as image)", position: "auto", width: 360, height: 420, sendComponentImageAsContext: true }}
                windowContent={<DefaultChatbot conversationId="example-red" welcome="I can see the component's content, ask me anything about it." inputValue="Which number is in red color?" placeholderApiKey={apiKey} />}
              >
                {/* <div className="card"> */}
                <span>
                  24 and <span style={{ color: "#ef4444", fontWeight: 600 }}>18</span> are my favorite numbers.
                </span>
                {/* </div> */}
              </ChatEnabled>
            </div>
            <div className="example-container">
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
      </div>

      <div className="row gy-3 align-items-start mb-3">
        <div className="col-12 col-md-2"><h2>Agents</h2></div>
        <div className="col-12 col-md example-container">
          <h3>Simple agents</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Agents", position: "auto", width: 360, height: 420 }}
            windowContent={
              <DefaultChatbot
                conversationId="example-agents"
                placeholderApiKey={apiKey}
                agents={[
                  { id: "analyst", name: "Analyst", systemPrompt: "You are a data analyst who explains charts and numbers clearly." },
                  { id: "support", name: "Support", systemPrompt: "You are a helpful product support agent for our app." },
                ]}
              />
            }
          >
            <div className="card">Open window (agents)</div>
          </ChatEnabled>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);


