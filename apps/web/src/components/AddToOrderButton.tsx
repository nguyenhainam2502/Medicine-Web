'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

interface AddToOrderButtonProps {
    productId: string;
    productName: string;
    imageUrl?: string | null;
    category?: string | null;
}

export default function AddToOrderButton({ productId, productName, imageUrl, category }: AddToOrderButtonProps) {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddToOrder = () => {
        setLoading(true);
        try {
            // Thêm vào Giỏ ảo thay vì insert thẳng DB
            addToCart({
                id: productId,
                name: productName,
                image_url: imageUrl || undefined,
                category: category || undefined,
                quantity: 1
            });
            showToast('success', 'Đã thêm vào toa!');
        } catch {
            showToast('error', 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Toast */}
            {toast && (
                <div className={`
                    fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4
                    rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 duration-300
                    ${toast.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'}
                `}>
                    <span className="material-symbols-outlined text-[20px]">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {toast.msg}
                </div>
            )}

            <button
                onClick={handleAddToOrder}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-[#2b8cee] text-white text-base font-bold shadow-xl shadow-[#2b8cee]/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'progress_activity' : 'add_shopping_cart'}
                </span>
                {loading ? 'Đang thêm...' : 'Thêm vào toa'}
            </button>
        </div>
    );
}
