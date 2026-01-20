import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type Props = {
    products: Product[];
};

export default function ProductGrid({ products }: Props) {
    if (products.length === 0) {
        return <p>No hay productos</p>;
    }

    return (
        <ul>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    );
}
