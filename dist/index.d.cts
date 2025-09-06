import React from 'react';

type FloatingWindowCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type FloatingWindowPosition = FloatingWindowCorner | "auto";
type FloatingWindowProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void;
    position?: FloatingWindowPosition;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    offset?: number;
    zIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    headerClassName?: string;
    bodyClassName?: string;
    closeButtonAriaLabel?: string;
    closeOnEscape?: boolean;
    draggable?: boolean;
    anchorRect?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
    } | null;
};
declare const FloatingWindow: React.FC<FloatingWindowProps>;

type ChatEnabledTrigger = "hover" | "focus" | "always" | "manual";
type ChatEnabledProps = {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
    trigger?: ChatEnabledTrigger;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    renderButton?: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        visible: boolean;
        ref: React.Ref<HTMLButtonElement>;
    }) => React.ReactNode;
    openWindowOnClick?: boolean;
    windowProps?: Omit<FloatingWindowProps, "children">;
    windowContent?: React.ReactNode;
};
declare const ChatEnabled: React.ForwardRefExoticComponent<ChatEnabledProps & React.RefAttributes<HTMLButtonElement>>;

type DefaultChatbotProps = {
    model?: string;
    placeholderApiKey?: string;
    systemPrompt?: string;
    welcome?: string;
    className?: string;
    style?: React.CSSProperties;
    conversationId?: string | null;
};
declare const DefaultChatbot: React.FC<DefaultChatbotProps>;

declare const CHAT_STORAGE_PREFIX = "ai-hud:default-chatbot:history:";
declare function getConversationStorageKey(conversationId: string): string;
declare function clearConversation(conversationId: string): void;
declare function clearAllConversations(): void;

export { CHAT_STORAGE_PREFIX, ChatEnabled, type ChatEnabledProps, DefaultChatbot, type DefaultChatbotProps, FloatingWindow, type FloatingWindowCorner, type FloatingWindowPosition, type FloatingWindowProps, clearAllConversations, clearConversation, getConversationStorageKey };
