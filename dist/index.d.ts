import React from 'react';

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
};
declare const ChatEnabled: React.ForwardRefExoticComponent<ChatEnabledProps & React.RefAttributes<HTMLButtonElement>>;

export { ChatEnabled, type ChatEnabledProps };
