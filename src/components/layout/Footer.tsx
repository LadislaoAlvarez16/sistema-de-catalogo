"use client";

import { MessageCircle } from "lucide-react";

type Props = {
    accountData: { name: string; description: string | null };
    phoneNumber?: string;
};

export default function Footer({ accountData, phoneNumber }: Props) {
    const cleanPhone = phoneNumber?.replace(/\D/g, "") ?? "";
    const whatsappHref = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hola, me gustaría consultar por sus productos.")}`
        : "#";

    return (
        <footer className="border-t border-gray-200 bg-gray-50 py-12 px-4">
            <div className="mx-auto max-w-5xl flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900">{accountData.name}</h3>
                    <p className="mt-2 max-w-xs text-sm text-gray-500">
                        Gracias por visitar nuestro catálogo online. Contáctanos para más información.
                    </p>
                </div>

                {phoneNumber && (
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        <span>Consultar por WhatsApp</span>
                    </a>
                )}
            </div>

            <div className="mx-auto my-8 h-px w-full bg-gray-200"></div>

            <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:text-left">
                <p>© 2026 {accountData.name}. Todos los derechos reservados.</p>
                <p>
                    Desarrollado por{" "}
                    <a href="mailto:ladislaoalvarez16@gmail.com" className="text-blue-600 hover:underline">
                        [ladislaoalvarez16@gmail.com]
                    </a>
                </p>
            </div>
        </footer>
    );
}