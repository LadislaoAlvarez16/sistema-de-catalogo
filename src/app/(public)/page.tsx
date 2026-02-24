import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/catalog/ProductGrid";


export default async function PublicPage() {
    const { data: products, error } = await supabase
        .from("products")
        .select(`
      id,
      slug,
      name,
      description,
      price,
      category,
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
            <ProductGrid products={products} />
        </main>
    );
}
