import type { Product } from "@/types/product";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canShowPrices } from "@/lib/plan/plan.helpers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const { plan } = getCatalogConfig();
    const showPrice = canShowPrices(plan);

    const imageSrc = product.image_url || "/placeholder.png";

    return (
        <li
            style={{
                border: "1px solid #222",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 24,
            }}
        >
            <Image
                src={imageSrc}
                alt={product.name}
                width={300}
                height={300}
                style={{ objectFit: "cover", borderRadius: 8 }}
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
