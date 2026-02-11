import { getCatalogConfig } from "@/lib/config/getCatalogConfig";

type Props = {
    message: string;
    phone?: string;
};

export default function WhatsAppButton({
    message,
    phone,
}: Props) {
    const { whatsapp } = getCatalogConfig();

    const finalPhone = phone ?? whatsapp;
    const encodedMessage = encodeURIComponent(message);
    const href = `https://wa.me/${finalPhone}?text=${encodedMessage}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block mt-3 rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 transition"
        >
            Consultar por WhatsApp
        </a>
    );
}
