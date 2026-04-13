export type Product = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number | null;
    category_id?: string | null;
    category: string;
    image_url: string | null;
    active: boolean;
    account_id: string;
};