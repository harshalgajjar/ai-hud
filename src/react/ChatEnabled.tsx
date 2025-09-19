import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { FloatingWindow, FloatingWindowProps } from "./FloatingWindow";

export type ChatEnabledTrigger = "hover" | "focus" | "always" | "manual";

export type ChatEnabledProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  offset?: number;
  icon?: React.ReactNode;
  className?: string; // container className
  containerStyle?: React.CSSProperties;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  buttonSize?: number; // px, default 36
  zIndex?: number; // default 10
  disabled?: boolean;
  trigger?: ChatEnabledTrigger; // default 'hover'
  open?: boolean; // used when trigger is 'manual'
  onOpenChange?: (open: boolean) => void; // notifies visibility changes
  renderButton?: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      visible: boolean;
      ref: React.Ref<HTMLButtonElement>;
    }
  ) => React.ReactNode;
  // Optional built-in floating window support
  openWindowOnClick?: boolean; // default false
  windowProps?: (Omit<FloatingWindowProps, "children"> & { sendComponentImageAsContext?: boolean });
  windowContent?: React.ReactNode; // custom content; if absent, shows nothing
};

export const ChatEnabled = React.forwardRef<HTMLButtonElement, ChatEnabledProps>(
  (
    {
      children,
      onClick,
      label = "Open chat",
      position = "top-right",
      offset = 8,
      icon,
      className,
      containerStyle,
      buttonClassName,
      buttonStyle,
      buttonSize = 36,
      zIndex = 10,
      disabled = false,
      trigger,
      open,
      onOpenChange,
      renderButton,
      openWindowOnClick = false,
      windowProps,
      windowContent,
    },
    ref
  ) => {
    const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const internalButtonRef = useRef<HTMLButtonElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const captureRef = useRef<HTMLDivElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const resolvedTrigger: ChatEnabledTrigger = trigger ?? "hover";

    const positionStyle = useMemo<React.CSSProperties>(() => {
      const base: React.CSSProperties = { position: "absolute" };
      const offsetPx = `${offset}px`;
      switch (position) {
        case "top-left":
          return { ...base, top: offsetPx, left: offsetPx };
        case "top-right":
          return { ...base, top: offsetPx, right: offsetPx };
        case "bottom-left":
          return { ...base, bottom: offsetPx, left: offsetPx };
        case "bottom-right":
        default:
          return { ...base, bottom: offsetPx, right: offsetPx };
      }
    }, [position, offset]);

    const computedVisible = (() => {
      if (resolvedTrigger === "always") return true;
      if (resolvedTrigger === "manual") return Boolean(open);
      // hover or focus: we use the same internal state
      return isHoveredOrFocused;
    })();

    const notifyOpenChange = (next: boolean) => {
      if (onOpenChange) onOpenChange(next);
    };

    const containerEventHandlers = {
      onMouseEnter: resolvedTrigger === "hover" ? () => { setIsHoveredOrFocused(true); notifyOpenChange(true); } : undefined,
      onMouseLeave: resolvedTrigger === "hover" ? () => { setIsHoveredOrFocused(false); notifyOpenChange(false); } : undefined,
      onFocus: resolvedTrigger === "focus" ? () => { setIsHoveredOrFocused(true); notifyOpenChange(true); } : undefined,
      onBlur: resolvedTrigger === "focus" ? () => { setIsHoveredOrFocused(false); notifyOpenChange(false); } : undefined,
    } as const;
    const sendImageFlag = Boolean((windowProps as any)?.sendComponentImageAsContext);

    useEffect(() => {
      const doCapture = async () => {
        if (!sendImageFlag) return;
        const target = captureRef.current;
        if (!target) return;
        try {
          // Wait a tick to ensure layout has settled
          await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50)));
          const canvas = await html2canvas(target, {
            useCORS: true,
            backgroundColor: null,
            scale: Math.min(2, Math.max(1, Math.ceil((target as HTMLElement).offsetWidth / 280))),
          });
          const dataUrl = canvas.toDataURL("image/png", 0.92);
          setCapturedImage(dataUrl);
        } catch {
          // ignore capture errors
        }
      };
      if (isWindowOpen) {
        void doCapture();
      }
    }, [isWindowOpen, sendImageFlag]);


    const setMergedRef = (el: HTMLButtonElement | null) => {
      internalButtonRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      }
    };

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref: typeof ref; visible: boolean } = {
      type: "button",
      "aria-label": label,
      onClick: (e) => {
        onClick?.(e);
        if (!disabled && openWindowOnClick) setIsWindowOpen(true);
      },
      className: buttonClassName,
      disabled,
      style: {
        ...positionStyle,
        zIndex,
        width: buttonSize,
        height: buttonSize,
        borderRadius: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(0,0,0,0.08)",
        background: disabled ? "#f3f4f6" : "white",
        color: disabled ? "#9ca3af" : "#111827",
        boxShadow:
          "0 2px 6px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 120ms ease, transform 120ms ease",
        opacity: computedVisible ? 1 : 0,
        transform: computedVisible ? "scale(1)" : "scale(0.95)",
        pointerEvents: computedVisible ? "auto" : "none",
        ...buttonStyle,
      },
      tabIndex: computedVisible ? 0 : -1,
      "aria-hidden": computedVisible ? undefined : true,
      ref: setMergedRef,
      visible: computedVisible,
    };

    return (
      <div
        className={className}
        style={{ position: "relative", display: "inline-block", ...containerStyle }}
        {...containerEventHandlers}
        ref={containerRef}
      >
        <div ref={captureRef} style={{ display: "inline-block" }}>
          {children}
        </div>
        {renderButton ? (
          renderButton(buttonProps)
        ) : (
          <button {...buttonProps}>
            {icon ?? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={Math.max(16, Math.floor(buttonSize * 0.62))}
                height={Math.max(16, Math.floor(buttonSize * 0.62))}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                style={{ width: Math.max(16, Math.floor(buttonSize * 0.62)), height: Math.max(16, Math.floor(buttonSize * 0.62)), display: "block" }}
              >
                <path vectorEffect="non-scaling-stroke" d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            )}
          </button>
        )}
        {openWindowOnClick && isWindowOpen && windowContent && (
          <FloatingWindow
            {...(windowProps as FloatingWindowProps)}
            onClose={() => {
              windowProps?.onClose?.();
              setIsWindowOpen(false);
              setCapturedImage(null);
            }}
            anchorRect={
              (windowProps as FloatingWindowProps | undefined)?.anchorRect ??
              (internalButtonRef.current
                ? internalButtonRef.current.getBoundingClientRect()
                : null)
            }
          >
            {(() => {
              if (sendImageFlag) {
                if (!capturedImage) {
                  return (
                    <div style={{ padding: 12, color: "#6b7280", fontSize: 14 }}>
                      Loading...
                    </div>
                  );
                }
                if (React.isValidElement(windowContent)) {
                  const prev = (windowContent.props as any)?.contextImages as string[] | undefined;
                  const merged = [...(prev ?? []), capturedImage];
                  try {
                    return React.cloneElement(windowContent as any, { contextImages: merged });
                  } catch {
                    return windowContent;
                  }
                }
              }
              return windowContent;
            })()}
          </FloatingWindow>
        )}
      </div>
    );
  }
);

ChatEnabled.displayName = "ChatEnabled";

// For convenience, also export a lower-cased alias for named import
// Note: in JSX you must still use <ChatEnabled />, not <chatEnabled />
export const chatEnabled = ChatEnabled;


