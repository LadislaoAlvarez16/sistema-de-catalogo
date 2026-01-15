import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default async function PublicPage() {
    const { data: products, error } = await supabase
        .from("products")
        .select(`
      id,
      name,
      description,
      price,
      category_id,
      image_url,
      active,
      created_at
    `)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .returns<Product[]>();

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </main>
        );
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Productos</h1>

            {products.length === 0 && <p>No hay productos</p>}

            <ul>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>
        </main>
    );
}
