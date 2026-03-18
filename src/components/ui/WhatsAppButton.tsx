"use client";

type Props = {
    message: string;
    phoneNumber?: string;
};

export default function WhatsAppButton({
    message,
    phoneNumber,
}: Props) {
    // Limpiamos el número (sacamos espacios, guiones, símbolos raros)
    const cleanPhone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
    const encodedMessage = encodeURIComponent(message);

    // Si hay número va directo al chat, si no, abre WhatsApp para elegir contacto
    const href = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
        : `https://api.whatsapp.com/send?text=${encodedMessage}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block text-center mt-3 rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 transition w-full"
        >
            Consultar por WhatsApp
        </a>
    );
}