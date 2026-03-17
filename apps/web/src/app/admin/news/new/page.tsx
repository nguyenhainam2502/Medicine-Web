import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

async function createNews(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const data = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    content: formData.get('content') as string,
    image_url: (formData.get('image_url') as string)?.trim() || null,
    author: (formData.get('author') as string) || 'MedAI Pro',
    published: formData.get('published') === 'on',
  };
  const { error } = await supabase.from('news').insert(data);
  if (error) redirect('/admin/news/new?error=' + encodeURIComponent(error.message));
  redirect('/admin/news');
}

export default async function NewNewsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/news" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>Danh sách tin
        </a>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-black text-slate-900">Thêm tin tức mới</h1>
      </div>

      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form action={createNews} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề *</label>
            <input name="title" required placeholder="Tiêu đề bài viết..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tác giả</label>
            <input name="author" defaultValue="MedAI Pro" placeholder="Tên tác giả..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">🖼️ URL Ảnh bìa</label>
            <input name="image_url" type="text" placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tóm tắt</label>
            <textarea name="summary" rows={3} placeholder="Mô tả ngắn gọn về bài viết..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung bài viết *</label>
            <textarea name="content" required rows={15} placeholder="Nội dung chi tiết của bài viết..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-none" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input type="checkbox" name="published" id="published" className="w-5 h-5 accent-[#2b8cee] cursor-pointer" />
            <label htmlFor="published" className="text-sm font-bold text-slate-700 cursor-pointer">
              ✅ Đăng ngay (public)
            </label>
            <span className="text-xs text-slate-400 ml-1">— Bỏ chọn để lưu nháp</span>
          </div>

          <div className="flex gap-4 pt-2 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
              <span className="material-symbols-outlined">save</span>Lưu bài viết
            </button>
            <a href="/admin/news" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Hủy bỏ
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
