'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(''); setSuccess('');
        if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không khớp!'); return; }
        if (newPassword.length < 6) { setError('Mật khẩu mới phải có ít nhất 6 ký tự.'); return; }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setLoading(false);

        if (error) { setError(error.message); return; }
        setSuccess('Đổi mật khẩu thành công! Đang chuyển về trang tài khoản...');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setTimeout(() => router.push('/profile'), 2000);
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium mb-10">
                <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
                </a>
                <span className="text-slate-300">/</span>
                <a href="/profile" className="text-slate-500 hover:text-[#2b8cee] transition-colors">Tài khoản</a>
                <span className="text-slate-300">/</span>
                <span className="text-[#2b8cee] font-bold">Đổi mật khẩu</span>
            </nav>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#2b8cee]/10 text-[#2b8cee] flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">lock_reset</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Đổi mật khẩu</h1>
                        <p className="text-slate-500 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">error</span>{error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>{success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Mật khẩu hiện tại</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Nhập mật khẩu hiện tại"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 focus:bg-white transition" />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-2" />

                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Mật khẩu mới</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">key</span>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Tối thiểu 6 ký tự"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 focus:bg-white transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">key</span>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Nhập lại mật khẩu mới"
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 focus:bg-white transition ${confirmPassword && confirmPassword !== newPassword ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`} />
                        </div>
                        {confirmPassword && confirmPassword !== newPassword && (
                            <p className="text-xs text-red-500 mt-1 font-medium">Mật khẩu chưa khớp</p>
                        )}
                    </div>

                    {/* Password strength hint */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 mb-2">Yêu cầu mật khẩu:</p>
                        <ul className="space-y-1">
                            {[
                                { check: newPassword.length >= 6, text: 'Ít nhất 6 ký tự' },
                                { check: /[A-Z]/.test(newPassword), text: 'Có chữ hoa' },
                                { check: /[0-9]/.test(newPassword), text: 'Có chữ số' },
                            ].map(r => (
                                <li key={r.text} className={`text-xs flex items-center gap-2 font-medium ${r.check ? 'text-green-600' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{r.check ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    {r.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md disabled:opacity-60">
                            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                : <><span className="material-symbols-outlined">lock_reset</span>Cập nhật mật khẩu</>}
                        </button>
                        <a href="/profile" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                            Hủy bỏ
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
