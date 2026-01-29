import type { Product } from "@/types/product";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";
import { getProductImageUrl } from "@/lib/storage/getProductImageUrl";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const { plan } = getCatalogConfig();
    const showPrice = canShowPrices(plan);

    const imageSrc = getProductImageUrl(product.image_url);

    return (
        <li className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition">

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
