'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setFullName(data.user?.user_metadata?.full_name ?? '');
            if (data.user) {
                supabase.from('profiles').select('role').eq('id', data.user.id).single()
                    .then(({ data: p }) => setRole(p?.role ?? null));
            }
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true); setSuccess('');
        await supabase.auth.updateUser({ data: { full_name: fullName } });
        setSaving(false);
        setSuccess('Cập nhật thông tin thành công!');
    }

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

    const initials = user.email?.charAt(0).toUpperCase() ?? '?';

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium mb-10">
                <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
                </a>
                <span className="text-slate-300">/</span>
                <span className="text-[#2b8cee] font-bold">Thông tin tài khoản</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Avatar Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2b8cee] to-[#13a4ec] text-white flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-lg">
                            {initials}
                        </div>
                        <p className="font-black text-slate-900 text-lg">{user.user_metadata?.full_name || 'Chưa đặt tên'}</p>
                        <p className="text-slate-500 text-sm truncate mt-1">{user.email}</p>

                        {role && (
                            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b8cee]/10 text-[#2b8cee] text-xs font-black">
                                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                                {role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="material-symbols-outlined text-[20px] text-slate-400">mail</span>
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="material-symbols-outlined text-[20px] text-slate-400">calendar_today</span>
                                <span>Tham gia {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-[20px] text-green-500">verified</span>
                                <span className="text-green-600 font-semibold">Email đã xác thực</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mt-6 space-y-1">
                        <a href="/profile/change-password" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-[#2b8cee] transition-colors text-sm font-medium">
                            <span className="material-symbols-outlined text-[20px]">lock_reset</span>Đổi mật khẩu
                        </a>
                        <a href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-[#2b8cee] transition-colors text-sm font-medium">
                            <span className="material-symbols-outlined text-[20px]">receipt_long</span>Đơn hàng của tôi
                        </a>
                        {role && (
                            <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#2b8cee] hover:bg-[#2b8cee]/5 transition-colors text-sm font-bold">
                                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>Quản lý web
                            </a>
                        )}
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#2b8cee]">edit</span>
                            Chỉnh sửa thông tin
                        </h2>

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>{success}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Họ và tên</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn A"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 focus:bg-white transition" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                    <input type="email" value={user.email ?? ''} disabled
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed" />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Email không thể thay đổi sau khi đăng ký.</p>
                            </div>

                            <div className="pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md disabled:opacity-60">
                                    {saving
                                        ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        : <><span className="material-symbols-outlined">save</span>Lưu thay đổi</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#2b8cee]">bar_chart</span>
                            Hoạt động tài khoản
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: 'medication', label: 'Thuốc đã xem', value: '—', color: 'text-[#2b8cee] bg-[#2b8cee]/10' },
                                { icon: 'receipt_long', label: 'Đơn hàng', value: '0', color: 'text-green-600 bg-green-50' },
                            ].map(s => (
                                <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                                        <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
