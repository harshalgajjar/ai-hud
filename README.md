## @ai-hud/chat-enabled

A lightweight React wrapper that overlays a clean hover chat button on its children.

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