'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export default function OrdersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <span className="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span>
        </div>
    );

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">lock</span>
            <p className="text-slate-500 font-medium">Bạn chưa đăng nhập</p>
            <a href="/login" className="bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors">Đăng nhập ngay</a>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium mb-10">
                <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
                </a>
                <span className="text-slate-300">/</span>
                <a href="/profile" className="text-slate-500 hover:text-[#2b8cee] transition-colors">Tài khoản</a>
                <span className="text-slate-300">/</span>
                <span className="text-[#2b8cee] font-bold">Đơn hàng</span>
            </nav>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Đơn hàng của tôi</h1>
                    <p className="text-slate-500 text-sm mt-1">Theo dõi lịch sử và trạng thái đơn hàng</p>
                </div>
                <a href="/" className="flex items-center gap-2 bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md text-sm">
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Mua thêm thuốc
                </a>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit">
                {['Tất cả', 'Đang xử lý', 'Đã giao', 'Đã hủy'].map((t, i) => (
                    <button key={t} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-slate-300">receipt_long</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Chưa có đơn hàng nào</h3>
                    <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
                        Bạn chưa thực hiện đơn hàng nào. Khám phá danh mục thuốc và đặt hàng ngay hôm nay!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/" className="flex items-center justify-center gap-2 bg-[#2b8cee] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-lg shadow-[#2b8cee]/20">
                            <span className="material-symbols-outlined">medication</span>
                            Duyệt danh mục thuốc
                        </a>
                        <a href="/symptom-check" className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined">psychology</span>
                            Hỏi trợ lý AI
                        </a>
                    </div>
                </div>
            </div>

            {/* Feature Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: 'local_shipping', title: 'Giao hàng nhanh', desc: 'Nhận thuốc trong 2-4 giờ tại nội thành', color: 'text-green-600 bg-green-50' },
                    { icon: 'verified_user', title: 'Chất lượng đảm bảo', desc: 'Thuốc chính hãng, còn hạn sử dụng', color: 'text-[#2b8cee] bg-[#2b8cee]/10' },
                    { icon: 'undo', title: 'Hoàn trả dễ dàng', desc: 'Đổi trả trong vòng 7 ngày nếu có lỗi', color: 'text-orange-500 bg-orange-50' },
                ].map(f => (
                    <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
                        <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <span className="material-symbols-outlined text-[20px]">{f.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">{f.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
