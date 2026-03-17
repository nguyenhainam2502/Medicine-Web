'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); setLoading(false); return; }
        router.push('/');
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');

        // Gọi server action - tạo user qua Admin API (bypass email confirmation)
        const formData = new FormData();
        formData.set('email', email);
        formData.set('password', password);
        formData.set('full_name', name);

        const { signUpAction } = await import('./actions');
        const result = await signUpAction(formData);

        if (result.error) {
            const msg = result.error.includes('already registered')
                ? 'Email này đã được đăng ký rồi.'
                : result.error;
            setError(msg); setLoading(false); return;
        }

        // Tự đăng nhập sau khi tạo account thành công
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { setError('Tạo tài khoản thành công! Vui lòng đăng nhập.'); setLoading(false); return; }
        router.push('/');
        router.refresh();
    }

    return (
        <div className="min-h-[calc(100vh-65px)] bg-[#f6f7f8] flex flex-col">
            {/* Main */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                    {/* Left Panel - Branding */}
                    <div className="hidden md:flex md:w-1/2 relative bg-[#13a4ec]/10 overflow-hidden flex-col justify-between p-12">
                        {/* Background SVG Pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" fill="none" stroke="#13a4ec" strokeWidth="0.5" r="40" />
                                <circle cx="50" cy="50" fill="none" stroke="#13a4ec" strokeWidth="0.5" r="30" />
                                <circle cx="50" cy="50" fill="none" stroke="#13a4ec" strokeWidth="0.5" r="20" />
                                <line stroke="#13a4ec" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
                                <line stroke="#13a4ec" strokeWidth="0.5" x1="50" x2="50" y1="0" y2="100" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 text-[#13a4ec] mb-8">
                                <span className="material-symbols-outlined text-4xl">medical_services</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                                Quản lý Y tế <br />Thông minh & An toàn
                            </h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Tra cứu dược phẩm, kiểm tra triệu chứng và quản lý sức khỏe của bạn trong một nền tảng an toàn, đáng tin cậy.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                <span className="material-symbols-outlined text-[#13a4ec] bg-[#13a4ec]/10 p-2 rounded-full">lock</span>
                                <span className="text-sm font-semibold text-slate-700">Dữ liệu được mã hoá bảo mật</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                <span className="material-symbols-outlined text-[#13a4ec] bg-[#13a4ec]/10 p-2 rounded-full">verified_user</span>
                                <span className="text-sm font-semibold text-slate-700">Dữ liệu dược phẩm kiểm chứng y khoa</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                <span className="material-symbols-outlined text-[#13a4ec] bg-[#13a4ec]/10 p-2 rounded-full">auto_awesome</span>
                                <span className="text-sm font-semibold text-slate-700">AI hỗ trợ chẩn đoán thông minh</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="w-full md:w-1/2 p-8 sm:p-12">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-8">
                            <button
                                onClick={() => { setTab('signin'); setError(''); setSuccess(''); }}
                                className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'signin' ? 'border-[#13a4ec] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Đăng Nhập
                            </button>
                            <button
                                onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
                                className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'signup' ? 'border-[#13a4ec] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Tạo Tài Khoản
                            </button>
                        </div>

                        {/* Error/Success messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                {success}
                            </div>
                        )}

                        {/* Sign In Form */}
                        {tab === 'signin' && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Xin Chào Trở Lại</h2>
                                    <p className="text-slate-500 text-sm">Đăng nhập để tiếp tục sử dụng đầy đủ tính năng.</p>
                                </div>

                                <form onSubmit={handleSignIn} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13a4ec] focus:border-[#13a4ec] transition-all text-sm outline-none font-medium" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Mật khẩu</label>
                                            <a className="text-xs font-bold text-[#13a4ec] hover:underline" href="#">Quên mật khẩu?</a>
                                        </div>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13a4ec] focus:border-[#13a4ec] transition-all text-sm outline-none font-medium" />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)}
                                            className="w-4 h-4 text-[#13a4ec] bg-slate-100 border-slate-300 rounded focus:ring-[#13a4ec]" />
                                        <label htmlFor="remember" className="ml-2 text-sm text-slate-600">Ở lại đăng nhập 30 ngày</label>
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3 px-4 bg-[#13a4ec] text-white font-bold rounded-xl hover:bg-[#13a4ec]/90 shadow-lg shadow-[#13a4ec]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <><span>Đăng Nhập</span><span className="material-symbols-outlined text-lg">login</span></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Sign Up Form */}
                        {tab === 'signup' && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Tạo Tài Khoản</h2>
                                    <p className="text-slate-500 text-sm">Điền thông tin để đăng ký tài khoản mới, hoàn toàn miễn phí.</p>
                                </div>

                                <form onSubmit={handleSignUp} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Họ và tên</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nguyễn Văn A"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13a4ec] focus:border-[#13a4ec] transition-all text-sm outline-none font-medium" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13a4ec] focus:border-[#13a4ec] transition-all text-sm outline-none font-medium" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Mật khẩu</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Tối thiểu 6 ký tự"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13a4ec] focus:border-[#13a4ec] transition-all text-sm outline-none font-medium" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3 px-4 bg-[#13a4ec] text-white font-bold rounded-xl hover:bg-[#13a4ec]/90 shadow-lg shadow-[#13a4ec]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <><span>Đăng Ký Miễn Phí</span><span className="material-symbols-outlined text-lg">person_add</span></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Divider */}
                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hoặc</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        {/* Social buttons */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-3 py-2 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.15-1.74 4.07-1.12 1.12-2.88 2.41-5.63 2.41-4.83 0-8.75-3.91-8.75-8.75s3.92-8.75 8.75-8.75c2.6 0 4.54 1.02 5.94 2.34l2.33-2.33C19.16 1.19 16.32 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c3.7 0 6.48-1.21 8.66-3.48 2.26-2.26 2.97-5.44 2.97-8.08 0-.58-.05-1.13-.15-1.64h-11.46z" fill="#EA4335" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 py-2 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium">
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center">
                <p className="text-sm text-slate-400">© 2025 MedAI Pro. Dữ liệu y tế được mã hoá và bảo vệ.</p>
                <div className="mt-3 flex justify-center gap-6">
                    <a className="text-xs text-slate-400 hover:text-[#13a4ec]" href="#">Điều khoản sử dụng</a>
                    <a className="text-xs text-slate-400 hover:text-[#13a4ec]" href="#">Chính sách bảo mật</a>
                </div>
            </footer>
        </div>
    );
}
