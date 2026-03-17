'use server';

/**
 * Tạo user qua Admin API - bypass email confirmation hoàn toàn
 * Dùng email_confirm: true để mark email là đã xác nhận
 */
export async function signUpAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;

    const { createAdminClient } = await import('@/lib/supabase');
    const admin = createAdminClient();

    // Tạo user với email đã confirm sẵn - không cần gửi email xác thực
    const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,           // ✅ Bypass email confirmation
        user_metadata: { full_name: fullName },
    });

    if (error) return { error: error.message };
    return { success: true, userId: data.user?.id };
}
