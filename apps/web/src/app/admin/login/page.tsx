import { login } from '../actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;
    const errorMsg = params.error;

    return (
        <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-[#2b8cee] mb-4">
                        <span className="material-symbols-outlined text-4xl">medical_services</span>
                        <h1 className="text-3xl font-black text-slate-900">MedAI Pro</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Hệ thống quản lý nội bộ <br /><span className="font-bold text-slate-700">Admin & Staff Portal</span></p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Đăng nhập</h2>
                    <p className="text-slate-500 text-sm mb-8">Chỉ dành cho nhân viên được ủy quyền.</p>

                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {decodeURIComponent(errorMsg)}
                        </div>
                    )}

                    <form action={login} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@benhvien.vn"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] text-slate-900 font-medium bg-slate-50 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] text-slate-900 font-medium bg-slate-50 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 bg-[#2b8cee] text-white font-bold rounded-xl hover:bg-[#2070c5] transition-colors shadow-lg shadow-[#2b8cee]/20 flex items-center justify-center gap-2 text-base mt-2"
                        >
                            <span className="material-symbols-outlined">login</span>
                            Đăng nhập hệ thống
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    Cần hỗ trợ? Liên hệ quản trị viên hệ thống.
                </p>
            </div>
        </div>
    );
}
