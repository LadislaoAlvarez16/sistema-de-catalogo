import type { Product } from "@/types/product";

type Props = {
    product: Product;
    onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                {product.description && (
                    <p className="text-zinc-300 mb-4">{product.description}</p>
                )}

                <p className="text-sm text-zinc-400">
                    Categoría: {product.category}
                </p>
            </div>
        </div>
    );
}
