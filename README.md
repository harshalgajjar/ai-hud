## @ai-hud/chat-enabled

A lightweight React component wrapper that allows for chatting with components, it's data and with any additional context.

### Installation

```bash
npm i @ai-hud/chat-enabled
# or
yarn add @ai-hud/chat-enabled
# or
pnpm add @ai-hud/chat-enabled
```

Peer dependencies:
- **react**: >=17
- **react-dom**: >=17

### Quick start

```tsx
import { ChatEnabled } from '@ai-hud/chat-enabled';

export default function Example() {
  return (
    <ChatEnabled onClick={() => console.log('Open chat')}> 
      <img src="/product.png" alt="Product" />
    </ChatEnabled>
  );
}
```

The button appears when the child is hovered (default). Click the button to trigger `onClick` (e.g., open your chat widget).

### Props

- **children**: React node to wrap. The overlay button is positioned relative to this container.
- **onClick**: Button click handler.
- **label**: Accessible label for the button. Default: "Open chat".
- **position**: One of "top-left" | "top-right" | "bottom-left" | "bottom-right". Default: "top-right".
- **offset**: Number of pixels from the edges. Default: 8.
- **icon**: Custom React node to render inside the button.
- **className**: Class for the outer container.
- **containerStyle**: Inline styles for the outer container.
- **buttonClassName**: Class for the floating button.
- **buttonStyle**: Inline styles for the floating button.
- **buttonSize**: Size of the button in px. Default: 36.
- **zIndex**: z-index for the button. Default: 10.
- **disabled**: Disables the button and dims styles.
- **trigger**: Visibility trigger: "hover" | "focus" | "always" | "manual". Default: "hover".
- **open**: When `trigger` is "manual", controls visibility.
- **onOpenChange(open)**: Called when visibility changes (hover/focus modes).
- **renderButton(props)**: Custom render function for the button. Receives common button props plus `visible` and `ref`.

### Examples

Default hover behavior:
```tsx
<ChatEnabled onClick={() => console.log('chat')}> 
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

Always visible with larger button and custom z-index:
```tsx
<ChatEnabled trigger="always" buttonSize={44} zIndex={20} onClick={() => {}}>
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

Custom button rendering:
```tsx
<ChatEnabled
  renderButton={(btn) => (
    <button {...btn} style={{ ...btn.style, background: '#111827', color: 'white' }}>
      Chat
    </button>
  )}
  onClick={() => {}}
>
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

Manual control:
```tsx
const [open, setOpen] = useState(false);

<ChatEnabled trigger="manual" open={open} onOpenChange={setOpen} onClick={() => {}}>
  <div />
</ChatEnabled>
```

Note: In JSX you must use `<ChatEnabled />` (PascalCase). A lower-cased alias is exported for named imports, but not for JSX tags.

### Floating window (built-in)

`ChatEnabled` can open a clean floating window on click. Pass `windowContent` for dynamic content and `windowProps` to control size/position.

```tsx
<ChatEnabled
  openWindowOnClick
  windowProps={{ title: 'Chat', position: 'bottom-right', width: 360, height: 480 }}
  windowContent={
    <div style={{ padding: 12 }}>
      {/* your chat UI here */}
      Hello world
    </div>
  }
>
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

`windowProps` controls the chat window: `title`, `position` (supports `auto`), `width`, `height`, `minWidth`, `minHeight`, `offset`, `zIndex`, `className`, `style`, `headerClassName`, `bodyClassName`, `closeButtonAriaLabel`, `closeOnEscape`, `onClose`, and `draggable` (defaults to `true`). With `position="auto"`, the window positions near the trigger button and stays fully within the viewport.

### Window options (windowProps)

- **title**: Title shown in the window header. Accepts text or a React node.
- **position**: Where to place the window relative to the trigger.
  - Values: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "auto"
  - "auto" tries to place near the trigger and keeps the window fully in the viewport.
- **width**: Window width in pixels. Default: 360.
- **height**: Window height in pixels. Default: 480.
- **minWidth**: Minimum width in pixels. Default: 280.
- **minHeight**: Minimum height in pixels. Default: 240.
- **offset**: Pixel gap from screen edges or the trigger when using auto positioning. Default: 16.
- **zIndex**: Stacking order. Default: 1000.
- **className**: CSS class for the outer window container.
- **style**: Inline styles for the outer window container.
- **headerClassName**: CSS class for the window header.
- **bodyClassName**: CSS class for the window body/content area.
- **closeButtonAriaLabel**: Accessible label for the close button. Default: "Close".
- **closeOnEscape**: Close the window when pressing Escape. Default: true.
- **onClose()**: Callback fired when the window closes.
- **draggable**: Allow dragging the window by its header. Default: true.

### Default chatbot (opt-in)

Use `DefaultChatbot` by passing it via `windowContent`. This is opt-in and not automatic.

```tsx
import { ChatEnabled, DefaultChatbot } from '@ai-hud/chat-enabled';

<ChatEnabled
  openWindowOnClick
  windowProps={{ title: 'Chat', position: 'bottom-right', width: 360, height: 480 }}
  windowContent={<DefaultChatbot />}
>
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

`DefaultChatbot` features:
- **message history**, **text input**, **multiple image upload previews**
- calls OpenAI chat completions with a placeholder key (replace with your own)
 - per-conversation persistence via `conversationId`:
   - pass a custom `conversationId` to persist/reuse a specific thread
   - omit it to auto-generate a new id for each mount

DefaultChatbot props (commonly used):
- **conversationId?**: string or null; when omitted, a new id is generated per mount
- **context?**: any JSON-serializable object; included as a system message for additional grounding/context
- **contextImages?**: string[] of HTTPS or data: URLs; images are sent with the first user message as vision context. Useful for screenshots/plots. When `sendComponentImageAsContext` is enabled on `windowProps`, the captured image is appended to this list.
- **systemPrompt?**: system instruction string
- **welcome?**: first assistant message in a new conversation
- **model?**: OpenAI model id (default: gpt-4o-mini)
- **placeholderApiKey?**: replace with your real API key

You can programmatically clear conversations:

```ts
import { clearConversation, clearAllConversations } from '@ai-hud/chat-enabled';

clearConversation('example-auto');
clearAllConversations();
```

Note: If you omit `conversationId`, an anonymous conversation is created and its history is automatically cleared from localStorage when the window closes.

### Send component image as context

You can automatically attach a screenshot of the wrapped child as visual context for the chatbot. Enable this by setting an option on `windowProps`.

```tsx
import { ChatEnabled, DefaultChatbot } from '@ai-hud/chat-enabled';

<ChatEnabled
  openWindowOnClick
  windowProps={{
    title: 'Ask about the component',
    position: 'auto',
    width: 360,
    height: 420,
    sendComponentImageAsContext: true,
  }}
  windowContent={
    <DefaultChatbot
      conversationId="example-red"
      welcome="Try asking: What is in red color?"
    />
  }
>
  <div style={{ width: 280, background: '#f3f4f6', borderRadius: 12, padding: 12 }}>
    This sentence has a <span style={{ color: '#ef4444', fontWeight: 600 }}>RED</span> word.
  </div>
</ChatEnabled>
```

How it works:
- When the window opens, the child is captured with a lightweight DOM screenshot and injected into the chatbot as `contextImages`.
- If capture isn’t ready yet, a short placeholder is shown; then the image is attached automatically.

Notes:
- The capture uses an inline DOM-to-image approach; external images must be CORS-enabled to avoid a tainted canvas.
- For best OCR, the capture is scaled up to improve legibility.
- If you already pass `contextImages` to `DefaultChatbot`, the captured image is appended.

You can also provide `contextImages` directly:

```tsx
<ChatEnabled openWindowOnClick windowProps={{ title: 'With images', position: 'auto', width: 360, height: 420 }}
  windowContent={
    <DefaultChatbot
      conversationId="example-images"
      contextImages={[
        'data:image/png;base64,iVBORw0K...', // or an https URL to a hosted image
      ]}
    />
  }
>
  <div style={{ width: 280, height: 160, background: '#f3f4f6', borderRadius: 12 }} />
</ChatEnabled>
```

### Local development

This repo includes a minimal Vite example for development:

```bash
# in repo root
npm install
npm run build

# run the example app
cd examples/basic
npm install
npm run dev
```

The example uses a path alias to the local `src/` for instant iteration. To test the built package instead, run `npm pack` in the root and install the generated tarball in the example.

### License

EPL-2.0 license