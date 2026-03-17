'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

interface Order {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    status: string;
    note: string | null;
    created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: 'Đang xử lý', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'pending' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle' },
    cancelled: { label: 'Đã hủy', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: 'cancel' },
};

export default function OrdersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchOrders = async (userId: string) => {
        const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        setOrders(data ?? []);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            if (data.user) fetchOrders(data.user.id);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = async (orderId: string) => {
        setCancellingId(orderId);
        await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
        setCancellingId(null);
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

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
                    <p className="text-slate-500 text-sm mt-1">{orders.length} đơn hàng</p>
                </div>
                <a href="/" className="flex items-center gap-2 bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md text-sm">
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Mua thêm thuốc
                </a>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit">
                {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'pending', label: 'Đang xử lý' },
                    { key: 'confirmed', label: 'Đã xác nhận' },
                    { key: 'cancelled', label: 'Đã hủy' },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setFilter(t.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl text-slate-300">receipt_long</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">Chưa có đơn hàng nào</h3>
                        <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
                            {filter === 'all'
                                ? 'Khám phá danh mục thuốc và thêm vào toa ngay hôm nay!'
                                : `Không có đơn hàng nào ở trạng thái này.`}
                        </p>
                        <a href="/" className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-lg">
                            <span className="material-symbols-outlined">medication</span>
                            Duyệt danh mục thuốc
                        </a>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-[#2b8cee]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[28px] text-[#2b8cee]">medication</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <a href={`/product/${order.product_id}`} className="font-black text-slate-900 text-base hover:text-[#2b8cee] transition-colors truncate block">
                                        {order.product_name}
                                    </a>
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Số lượng: {order.quantity} • {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {order.note && (
                                        <p className="text-xs text-slate-500 mt-1 italic">Ghi chú: {order.note}</p>
                                    )}
                                </div>

                                {/* Status + Action */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.color}`}>
                                        <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                                        {cfg.label}
                                    </span>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                            className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
