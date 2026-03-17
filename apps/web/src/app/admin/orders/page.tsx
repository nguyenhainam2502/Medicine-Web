import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

async function updateOrderStatus(formData: FormData) {
    'use server';
    const supabase = createAdminClient();
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;

    await supabase.from('orders').update({ status }).eq('id', id);
    revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage() {
    const supabase = createAdminClient();
    
    // Fetch all orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    const STATUS_MAP: Record<string, { label: string; color: string }> = {
        pending: { label: 'Đang xử lý', color: 'bg-amber-100 text-amber-700' },
        confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700' },
        cancelled: { label: 'Đã hủy', color: 'bg-slate-100 text-slate-600' },
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Quản lý Đơn hàng</h1>
                    <p className="text-slate-500 text-sm mt-1">Xem và cập nhật trạng thái đơn hàng của khách</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders?.map((order) => {
                            const cfg = STATUS_MAP[order.status] || STATUS_MAP.pending;
                            return (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-slate-500">{order.id.split('-')[0]}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{order.product_name}</p>
                                        {order.note && <p className="text-xs text-slate-500 mt-1 italic max-w-xs truncate">{order.note}</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-700">{order.quantity}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">
                                            {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={updateOrderStatus} className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <input type="hidden" name="id" value={order.id} />
                                            
                                            {order.status === 'pending' && (
                                                <>
                                                    <button type="submit" name="status" value="confirmed" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Xác nhận đơn">
                                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                    </button>
                                                    <button type="submit" name="status" value="cancelled" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hủy đơn">
                                                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                    </button>
                                                </>
                                            )}
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}

                        {(!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
