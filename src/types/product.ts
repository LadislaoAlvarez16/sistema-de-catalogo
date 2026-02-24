export type Product = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number | null;
    category: string;
    image_url: string | null;
    active: boolean;
};
