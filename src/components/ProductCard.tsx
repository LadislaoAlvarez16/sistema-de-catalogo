import type { Product } from "@/types/product";
import { getCatalogConfig } from "@/lib/config/getCatalogConfig";
import { canShowPrices } from "@/lib/plan/plan.helpers";

const { plan } = getCatalogConfig();
const showPrice = canShowPrices(plan);

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <li style={{ marginBottom: 16 }}>
            <h2>{product.name}</h2>

            {product.description && <p>{product.description}</p>}

            {showPrice && product.price !== null && (
                <strong>${product.price}</strong>

            )}

            <p>Categoría: {product.category}</p>
        </li>
    );
}
