import React from 'react';

type FloatingWindowCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type FloatingWindowProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void;
    position?: FloatingWindowCorner;
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
};
declare const DefaultChatbot: React.FC<DefaultChatbotProps>;

export { ChatEnabled, type ChatEnabledProps, DefaultChatbot, type DefaultChatbotProps, FloatingWindow, type FloatingWindowCorner, type FloatingWindowProps };
