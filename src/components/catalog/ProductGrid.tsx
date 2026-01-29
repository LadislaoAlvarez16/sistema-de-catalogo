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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    );
}    