import React, { useEffect, useRef, useState } from "react";

export type FloatingWindowCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type FloatingWindowPosition = FloatingWindowCorner | "auto";

export type FloatingWindowProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  onClose?: () => void;
  position?: FloatingWindowPosition;
  width?: number; // px
  height?: number; // px
  minWidth?: number;
  minHeight?: number;
  offset?: number; // px from edges
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  bodyClassName?: string;
  closeButtonAriaLabel?: string;
  closeOnEscape?: boolean;
  draggable?: boolean;
  // When position is 'auto', anchorRect helps place the window near the trigger button
  anchorRect?: { top: number; left: number; right: number; bottom: number; width: number; height: number } | null;
};

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  children,
  title,
  onClose,
  position = "bottom-right",
  width = 360,
  height = 480,
  minWidth = 280,
  minHeight = 240,
  offset = 16,
  zIndex = 1000,
  className,
  style,
  headerClassName,
  bodyClassName,
  closeButtonAriaLabel = "Close",
  closeOnEscape = true,
  draggable = true,
  anchorRect,
}) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; top: number; left: number } | null>(null);
  const [dragTopLeft, setDragTopLeft] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, onClose]);

  const edgeStyle: React.CSSProperties = (() => {
    const o = `${offset}px`;
    switch (position) {
      case "top-left":
        return { top: o, left: o };
      case "top-right":
        return { top: o, right: o };
      case "bottom-left":
        return { bottom: o, left: o };
      case "bottom-right":
      default:
        return { bottom: o, right: o };
    }
  })();

  const autoTopLeft: { top: number; left: number } | null = (() => {
    if (position !== "auto" || !anchorRect) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = offset;
    const preferBottom = anchorRect.top < vh / 2;
    const preferRight = anchorRect.left > vw / 2;
    const verticalOrder = preferBottom ? ["bottom", "top"] : ["top", "bottom"] as const;
    const horizontalOrder = preferRight ? ["right", "left"] : ["left", "right"] as const;

    const candidates: Array<"top-left" | "top-right" | "bottom-left" | "bottom-right"> = [
      `${verticalOrder[0]}-${horizontalOrder[0]}` as any,
      `${verticalOrder[0]}-${horizontalOrder[1]}` as any,
      `${verticalOrder[1]}-${horizontalOrder[0]}` as any,
      `${verticalOrder[1]}-${horizontalOrder[1]}` as any,
    ];

    for (const c of candidates) {
      let top = 0;
      let left = 0;
      if (c === "bottom-right") {
        top = anchorRect.bottom + gap;
        left = anchorRect.right - width;
      } else if (c === "bottom-left") {
        top = anchorRect.bottom + gap;
        left = anchorRect.left;
      } else if (c === "top-right") {
        top = anchorRect.top - height - gap;
        left = anchorRect.right - width;
      } else {
        top = anchorRect.top - height - gap;
        left = anchorRect.left;
      }
      const fits = top >= 0 && left >= 0 && top + height <= vh && left + width <= vw;
      if (fits) return { top, left };
    }
    // Fallback: clamp bottom-right relative to anchor
    let top = Math.min(Math.max(anchorRect.bottom + gap, 0), vh - height);
    let left = Math.min(Math.max(anchorRect.right - width, 0), vw - width);
    return { top, left };
  })();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY, top: rect.top, left: rect.left };
    setDragTopLeft({ top: rect.top, left: rect.left });
    setDragging(true);
    const handleMove = (ev: PointerEvent) => {
      if (!dragStart.current) return;
      const dx = ev.clientX - dragStart.current.x;
      const dy = ev.clientY - dragStart.current.y;
      setDragTopLeft({ top: dragStart.current.top + dy, left: dragStart.current.left + dx });
    };
    const handleUp = () => {
      setDragging(false);
      dragStart.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      className={className}
      style={{
        position: "fixed",
        ...(dragTopLeft
          ? { top: dragTopLeft.top, left: dragTopLeft.left }
          : autoTopLeft
          ? { top: autoTopLeft.top, left: autoTopLeft.left }
          : edgeStyle),
        width,
        height,
        minWidth,
        minHeight,
        zIndex,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 12,
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        userSelect: dragging ? "none" : undefined,
        ...style,
      }}
    >
      <div
        className={headerClassName}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "#f9fafb",
          cursor: draggable ? "move" : undefined,
        }}
        onPointerDown={handlePointerDown}
      >
        <div style={{ fontWeight: 600, color: "#111827" }}>{title}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeButtonAriaLabel}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          style={{
            width: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "white",
            cursor: "pointer",
            color: isCloseHovered ? "#ef4444" : undefined,
            transition: "color 120ms ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div
        className={bodyClassName}
        style={{ flex: 1, overflow: "auto", background: "#ffffff" }}
      >
        {children}
      </div>
    </div>
  );
};


