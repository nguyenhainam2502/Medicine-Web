'use server';

import { createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    // login dùng createAdminClient không hợp lệ - redirect về /login chính
    redirect('/login');
}

export async function logout() {
    // Logout được xử lý client-side trong UserMenu
    redirect('/login');
}
