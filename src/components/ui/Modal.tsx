"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  hideClose?: boolean;
}

const sizeMap = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-6xl",
};

export function Modal({ open, onClose, title, description, children, size = "md", className, hideClose }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              className={cn(
                "pointer-events-auto w-full glass rounded-2xl shadow-xl border border-white/8",
                sizeMap[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {(title || !hideClose) && (
                <div className="flex items-start justify-between p-5 border-b border-white/6">
                  <div>
                    {title && (
                      <h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
                    )}
                    {description && (
                      <p className="text-[13px] text-text-muted mt-0.5">{description}</p>
                    )}
                  </div>
                  {!hideClose && (
                    <button
                      onClick={onClose}
                      className="icon-btn ml-4 shrink-0"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-4 border-t border-white/6 mt-4", className)}>
      {children}
    </div>
  );
}
