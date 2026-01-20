import type { Product } from "@/types/product";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <li style={{ marginBottom: 16 }}>
            <h2>{product.name}</h2>

            {product.description && <p>{product.description}</p>}

            <strong>${product.price}</strong>

            <p>Categoría: {product.category}</p>
        </li>
    );
}
