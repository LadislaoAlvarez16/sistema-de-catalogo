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
        <ul
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
                padding: 0,
                listStyle: "none",
            }}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    );
}
