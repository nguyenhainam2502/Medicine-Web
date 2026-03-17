import { logout } from './actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f7f8] font-sans">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 text-white flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <a href="/admin/dashboard" className="flex items-center gap-2 text-[#2b8cee]">
                        <span className="material-symbols-outlined text-3xl">medical_services</span>
                        <div>
                            <h1 className="text-lg font-black text-white leading-tight">MedAI Pro</h1>
                            <p className="text-xs text-slate-400 font-medium leading-tight">Admin Portal</p>
                        </div>
                    </a>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-3 pb-2">Quản lý chung</p>

                    <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-sm">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        Tổng quan
                    </a>

                    <a href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-sm">
                        <span className="material-symbols-outlined text-[20px]">medication</span>
                        Quản lý Thuốc
                    </a>

                    <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-sm">
                        <span className="material-symbols-outlined text-[20px]">category</span>
                        Quản lý Danh mục
                    </a>

                    <a href="/admin/news" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-sm">
                        <span className="material-symbols-outlined text-[20px]">newspaper</span>
                        Quản lý Tin Tức
                    </a>

                    <div className="pt-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2">Xem trước</p>
                        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-sm">
                            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            Xem Website
                        </a>
                    </div>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <form action={logout}>
                        <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors font-medium text-sm">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Đăng xuất
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
