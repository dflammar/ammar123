"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState("");

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Detect hoverable elements
        const addHoverListeners = () => {
            const hoverables = document.querySelectorAll(
                'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
            );
            hoverables.forEach((el) => {
                el.addEventListener("mouseenter", () => setIsHovering(true));
                el.addEventListener("mouseleave", () => {
                    setIsHovering(false);
                    setCursorText("");
                });
            });

            // Detect elements with custom cursor text
            const textElements = document.querySelectorAll("[data-cursor-text]");
            textElements.forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    setIsHovering(true);
                    setCursorText((el as HTMLElement).dataset.cursorText || "");
                });
                el.addEventListener("mouseleave", () => {
                    setIsHovering(false);
                    setCursorText("");
                });
            });
        };

        // Initial and mutation observer
        addHoverListeners();
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            observer.disconnect();
        };
    }, [cursorX, cursorY]);

    // Don't render on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    return (
        <>
            {/* Dot cursor */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 0 : isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            >
                <div className="w-3 h-3 rounded-full bg-white" />
            </motion.div>

            {/* Ring cursor */}
            <motion.div
                className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isVisible ? 1 : 0,
                    width: isHovering ? 80 : 40,
                    height: isHovering ? 80 : 40,
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    mass: 0.5,
                }}
            >
                <div
                    className={`w-full h-full rounded-full border transition-all duration-300 flex items-center justify-center ${isHovering
                            ? "border-white/60 bg-white/10"
                            : "border-white/30"
                        }`}
                >
                    {cursorText && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="text-white text-[9px] font-bold uppercase tracking-[0.15em]"
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </div>
            </motion.div>
        </>
    );
}
