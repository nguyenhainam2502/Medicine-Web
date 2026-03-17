'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function UserMenu() {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function fetchRole(userId: string) {
        // Dùng RPC để bypass RLS - đáng tin cậy hơn direct query
        const { data, error } = await supabase.rpc('get_my_role');
        if (!error && data) setRole(data as string);
        else {
            // Fallback: direct query nếu RPC chưa được tạo
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .maybeSingle();
            setRole(profile?.role ?? null);
        }
    }

    useEffect(() => {
        setHydrated(true); // fix hydration mismatch
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            if (data.user) fetchRole(data.user.id);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchRole(session.user.id);
            else setRole(null);
        });

        return () => listener.subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null); setRole(null); setOpen(false);
        router.push('/');
        router.refresh();
    }

    // Tránh hydration mismatch - server render skeleton trước
    if (!hydrated) {
        return (
            <div className="flex items-center gap-3">
                <div className="w-24 h-10 bg-slate-100 rounded-lg animate-pulse" />
                <div className="w-24 h-10 bg-slate-200 rounded-lg animate-pulse" />
            </div>
        );
    }

    const initials = user?.email?.charAt(0).toUpperCase() ?? '?';
    const isStaff = role === 'admin' || role === 'staff';

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <a href="/login" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#2b8cee]/10 text-[#2b8cee] text-sm font-bold hover:bg-[#2b8cee]/20 transition-all">
                    Đăng nhập
                </a>
                <a href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#2b8cee] text-white text-sm font-bold shadow-lg shadow-[#2b8cee]/25 hover:brightness-110 transition-all">
                    Đăng ký
                </a>
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            {/* Avatar Button */}
            <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 group">
                {isStaff && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-[#2b8cee] text-white shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                        Admin
                    </span>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b8cee] to-[#13a4ec] text-white flex items-center justify-center text-base font-black shadow-md group-hover:scale-105 transition-transform ring-2 ring-white">
                    {initials}
                </div>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b8cee] to-[#13a4ec] text-white flex items-center justify-center text-base font-black flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{user.user_metadata?.full_name || 'Người dùng'}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        <a href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px] text-slate-400">account_circle</span>
                            Thông tin tài khoản
                        </a>
                        <a href="/profile/change-password" onClick={() => setOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px] text-slate-400">lock_reset</span>
                            Đổi mật khẩu
                        </a>
                        <a href="/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px] text-slate-400">receipt_long</span>
                            Đơn hàng của tôi
                        </a>

                        {isStaff && (
                            <>
                                <div className="mx-4 my-2 h-px bg-slate-100" />
                                <a href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#2b8cee] hover:bg-[#2b8cee]/5 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                                    Quản lý thông tin web
                                </a>
                            </>
                        )}

                        <div className="mx-4 my-2 h-px bg-slate-100" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
