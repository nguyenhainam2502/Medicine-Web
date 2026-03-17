'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface AddToOrderButtonProps {
    productId: string;
    productName: string;
}

export default function AddToOrderButton({ productId, productName }: AddToOrderButtonProps) {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddToOrder = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { error } = await supabase.from('orders').insert({
                user_id: user.id,
                product_id: productId,
                product_name: productName,
                quantity: 1,
                status: 'pending',
            });

            if (error) throw error;
            showToast('success', 'Đã thêm vào toa thuốc!');
        } catch {
            showToast('error', 'Có lỗi xảy ra, thử lại nhé!');
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
                    {toast.type === 'success' && (
                        <a href="/orders" className="underline underline-offset-2 ml-1 opacity-90 hover:opacity-100">
                            Xem toa
                        </a>
                    )}
                </div>
            )}

            <button
                onClick={handleAddToOrder}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-[#2b8cee] text-white text-base font-bold shadow-xl shadow-[#2b8cee]/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'progress_activity' : 'add_shopping_cart'}
                </span>
                {loading ? 'Đang thêm...' : 'Thêm vào toa'}
            </button>
        </div>
    );
}
