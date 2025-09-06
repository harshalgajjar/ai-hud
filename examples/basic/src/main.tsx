import React from "react";
import { createRoot } from "react-dom/client";
import { ChatEnabled } from "@ai-hud/chat-enabled";

function App() {
  return (
    <div>
      <h1>ChatEnabled basic example</h1>
      <p>Hover the card to see the chat button. Click logs to console.</p>
      <div style={{ marginTop: 16, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
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
        <div>
          <h3>Floating window</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat", position: "bottom-right", width: 360, height: 420, draggable: false }}
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
          <h3>Floating window with default chatbot</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (Left and draggable)", position: "bottom-left", width: 360, height: 420 }}
          >
            <div className="card">Open window (left)</div>
          </ChatEnabled>
        </div>
        <div>
          <h3>Floating window (auto position)</h3>
          <ChatEnabled
            openWindowOnClick
            windowProps={{ title: "Chat (Auto)", position: "auto", width: 360, height: 420 }}
          >
            <div className="card">Open window (auto)</div>
          </ChatEnabled>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);


