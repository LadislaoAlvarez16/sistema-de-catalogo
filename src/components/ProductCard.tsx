import type { Product } from "@/types/product";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Plan } from "@/lib/plan/plan.config";

type Props = {
    product: Product;
    plan: Plan;
    phoneNumber?: string; // Lo preparamos para recibir el número
    onClick?: () => void;
};

export default function ProductCard({ product, plan, phoneNumber, onClick }: Props) {
    const showPrice = canShowPrices(plan);
    const imageSrc = getProductImageUrl(product.image_url);

    // Armamos el texto dependiendo de si se muestra el precio o no
    const wpMessage = showPrice && product.price
        ? `Hola, me interesa el producto: *${product.name}* que está a *$${product.price}*. ¿Tienen stock?`
        : `Hola, me interesa el producto: *${product.name}*. ¿Me podrían dar más información?`;

    return (
        <li
            onClick={onClick}
            className="cursor-pointer flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition"
        >
            <Image
                src={imageSrc}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-56 object-cover rounded-lg"
            />

            <h2>{product.name}</h2>

            {product.description && <p className="text-sm text-zinc-400">{product.description}</p>}

            {showPrice && product.price !== null && (
                <strong className="text-lg">${product.price}</strong>
            )}

            <p className="text-xs text-zinc-500">Categoría: {product.category}</p>

            {/* Evitamos que el clic en el botón abra el modal de la tarjeta */}
            <div onClick={(e) => e.stopPropagation()} className="mt-auto pt-2">
                <WhatsAppButton
                    message={wpMessage}
                    phoneNumber={phoneNumber}
                />
            </div>
        </li>
    );
}