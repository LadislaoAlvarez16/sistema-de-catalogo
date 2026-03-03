import type { Product } from "@/types/product";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";
import type { Plan } from "@/lib/plan/plan.config";

type Props = {
    product: Product;
    plan: Plan;
    onClick?: () => void;
};

export default function ProductCard({ product, plan, onClick }: Props) {
    const showPrice = canShowPrices(plan);
    const imageSrc = getProductImageUrl(product.image_url);

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

            {product.description && <p>{product.description}</p>}

            {showPrice && product.price !== null && (
                <strong>${product.price}</strong>
            )}

            <p>Categoría: {product.category}</p>

            <WhatsAppButton
                message={`Hola, estoy interesado en el producto: ${product.name}`}
            />
        </li>
    );
}
