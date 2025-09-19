declare module "@ai-hud/chat-enabled" {
  import * as React from "react";
  export interface ChatEnabledProps {
    children?: React.ReactNode;
    onClick?: () => void;
    label?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    offset?: number;
    icon?: React.ReactNode;
    className?: string;
    containerStyle?: React.CSSProperties;
    buttonClassName?: string;
    buttonStyle?: React.CSSProperties;
    buttonSize?: number;
    zIndex?: number;
    disabled?: boolean;
    trigger?: "hover" | "focus" | "always" | "manual";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    renderButton?: (
      btn: React.ButtonHTMLAttributes<HTMLButtonElement> & { style?: React.CSSProperties; visible?: boolean }
    ) => React.ReactNode;
    openWindowOnClick?: boolean;
    windowProps?: any;
    windowContent?: React.ReactNode;
  }
  export const ChatEnabled: React.FC<ChatEnabledProps>;
  export const DefaultChatbot: React.FC<any>;
  export function clearConversation(id: string): void;
  export function clearAllConversations(): void;
  const _default: {};
  export default _default;
}

