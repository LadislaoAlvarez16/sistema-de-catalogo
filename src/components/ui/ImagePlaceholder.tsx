import { ImageOff } from "lucide-react";

type Props = {
    className?: string;
    text?: string;
};

export default function ImagePlaceholder({ className = "h-full w-full", text = "Sin imagen" }: Props) {
    // Fallback por rendimiento para evitar cargar una imagen estática de placeholder
    return (
        <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-500 ${className}`}>
            <ImageOff className="mb-2 h-8 w-8 text-gray-400" />
            {text && <span className="text-sm font-medium text-gray-400">{text}</span>}
        </div>
    );
}
