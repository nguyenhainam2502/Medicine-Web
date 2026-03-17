import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string; // Sử dụng product_id làm id
    name: string;
    quantity: number;
    image_url?: string;
    category?: string;
}

interface CartStore {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    get totalItems(): number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...item, quantity: item.quantity || 1 }] });
                }
            },
            removeFromCart: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) return get().removeFromCart(id);
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            get totalItems() {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'medai-cart-storage', // Lưu vào localStorage để không mất giỏ hàng khi F5
            storage: createJSONStorage(() => localStorage),
        }
    )
);
