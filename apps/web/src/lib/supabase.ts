import { createClient } from '@supabase/supabase-js';
import { createServerClient as createSSRServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (không có session - dùng để đọc public data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client dùng service role key - bypass RLS hoàn toàn (chỉ dùng server-side)
export function createAdminClient() {
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

// Server-side client với cookie session
export async function createServerClient() {
    const cookieStore = await cookies();
    return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                );
            },
        },
    });
}
