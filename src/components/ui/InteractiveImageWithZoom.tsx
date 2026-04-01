"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";

type Props = {
    src: string;
    alt: string;
    className?: string;
};

export default function InteractiveImageWithZoom({ src, alt, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`group relative cursor-pointer ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        aria-label="Cerrar zoom"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <Image
                        src={src}
                        alt={alt}
                        width={1200}
                        height={1200}
                        className="max-h-[90vh] w-auto object-contain"
                    />
                </div>
            )}
        </>
    );
}