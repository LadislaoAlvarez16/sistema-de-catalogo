export function getProductImageUrl(path: string | null | undefined): string {
    // 1. Si no hay imagen, devolvemos el placeholder
    if (!path) return "/placeholder.png";

    // 2. Si ya es una URL completa (empieza con http), la devolvemos tal cual
    if (path.startsWith("http")) {
        return path;
    }

    // 3. Si es solo el nombre de un archivo (lógica vieja), le armamos la URL
    const supabaseUrl = "https://rvmxxlwnrlbbfihhblmy.supabase.co/storage/v1/object/public/product-images/";
    return `${supabaseUrl}${path}`;
}