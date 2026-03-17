import { createServerClient } from '@/lib/supabase';

export default async function AdminDashboard() {
    const supabase = await createServerClient();
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    const { data: { user } } = await supabase.auth.getUser();

    const stats = [
        { label: 'Tổng số Thuốc', value: productCount ?? 0, icon: 'medication', color: 'text-[#2b8cee] bg-[#2b8cee]/10', link: '/admin/products' },
        { label: 'Danh mục hiện có', value: categoryCount ?? 0, icon: 'category', color: 'text-purple-600 bg-purple-50', link: '/admin/categories' },
        { label: 'Trạng thái hệ thống', value: 'Hoạt động', icon: 'check_circle', color: 'text-green-600 bg-green-50', link: '#' },
    ];

    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm text-slate-500 font-medium mb-1">Xin chào, <span className="font-bold text-[#2b8cee]">{user?.email}</span></p>
                <h1 className="text-3xl font-black text-slate-900">Tổng quan hệ thống</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((s) => (
                    <a key={s.label} href={s.link} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    </a>
                ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-xl font-black text-slate-900 mb-5">Thao tác nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <a href="/admin/products/new" className="bg-[#2b8cee] text-white p-6 rounded-2xl hover:bg-[#2070c5] transition-colors flex items-center gap-4 group shadow-lg shadow-[#2b8cee]/20">
                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                    <div>
                        <p className="font-black text-lg">Thêm thuốc mới</p>
                        <p className="text-blue-100 text-sm">Nhập đầy đủ thông tin dược lý</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                </a>

                <a href="/admin/categories" className="bg-white border-2 border-slate-200 p-6 rounded-2xl hover:border-slate-300 transition-colors flex items-center gap-4 group">
                    <span className="material-symbols-outlined text-3xl text-slate-700">add_box</span>
                    <div>
                        <p className="font-black text-lg text-slate-900">Thêm danh mục</p>
                        <p className="text-slate-500 text-sm">Quản lý chuyên khoa điều trị</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-400">arrow_forward</span>
                </a>
            </div>
        </div>
    );
}
