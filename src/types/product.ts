export type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category_id: string | null;
    image_url: string | null;
    active: boolean;
    created_at: string;
};