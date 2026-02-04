"use client";

import { ReactNode, useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: Props) {
    // Bloquea scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl max-w-lg w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
