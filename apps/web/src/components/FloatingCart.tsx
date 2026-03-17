'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';

export default function FloatingCart() {
    const [mounted, setMounted] = useState(false);
    const { items, totalItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
    const [isOpen, setIsOpen] = useState(false);

    // Tránh lỗi Hydration mismatch giữa Server và Client do dùng LocalStorage
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || totalItems === 0) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Nút Giỏ Hàng nổi */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-[#2b8cee] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white"
            >
                <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                </span>
            </button>

            {/* Popup Giỏ Hàng */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 origin-bottom-left duration-200">
                    <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">medication</span>
                            <h3 className="font-bold text-lg">Giỏ thuốc của bạn</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.image_url || `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&q=80&seed=${item.id}`} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                                    {item.category && <p className="text-xs text-[#2b8cee] font-medium mt-0.5">{item.category}</p>}
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center bg-slate-100 rounded-lg">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900">
                                                <span className="material-symbols-outlined text-[16px]">remove</span>
                                            </button>
                                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900">
                                                <span className="material-symbols-outlined text-[16px]">add</span>
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-auto">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <div className="flex gap-2">
                            <button onClick={clearCart} className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm">
                                Xóa hết
                            </button>
                            <button className="flex-1 bg-[#2b8cee] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-lg shadow-[#2b8cee]/20 flex items-center justify-center gap-2">
                                Chốt đơn
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
