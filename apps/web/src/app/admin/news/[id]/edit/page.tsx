import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

async function updateNews(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const data = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    content: formData.get('content') as string,
    image_url: (formData.get('image_url') as string)?.trim() || null,
    author: (formData.get('author') as string) || 'MedAI Pro',
    published: formData.get('published') === 'on',
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('news').update(data).eq('id', id);
  if (error) redirect(`/admin/news/${id}/edit?error=${encodeURIComponent(error.message)}`);
  redirect('/admin/news');
}

export default async function EditNewsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createServerClient();
  const { data: articles } = await supabase.from('news').select('*').eq('id', id);
  const article = articles?.[0];
  if (!article) redirect('/admin/news');

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/news" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>Danh sách tin
        </a>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-black text-slate-900">Sửa bài viết</h1>
      </div>

      {sp.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {decodeURIComponent(sp.error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form action={updateNews} className="space-y-6">
          <input type="hidden" name="id" value={article.id} />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề *</label>
            <input name="title" required defaultValue={article.title}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tác giả</label>
            <input name="author" defaultValue={article.author}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">🖼️ URL Ảnh bìa</label>
            {article.image_url && (
              <div className="mb-3 rounded-xl overflow-hidden h-32 bg-slate-100">
                <img src={article.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input name="image_url" type="text" defaultValue={article.image_url ?? ''} placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tóm tắt</label>
            <textarea name="summary" rows={3} defaultValue={article.summary}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung bài viết *</label>
            <textarea name="content" required rows={15} defaultValue={article.content}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-none" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input type="checkbox" name="published" id="published" defaultChecked={article.published}
              className="w-5 h-5 accent-[#2b8cee] cursor-pointer" />
            <label htmlFor="published" className="text-sm font-bold text-slate-700 cursor-pointer">
              ✅ Đăng công khai (public)
            </label>
          </div>

          <div className="flex gap-4 pt-2 border-t border-slate-100">
            <button type="submit" className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
              <span className="material-symbols-outlined">save</span>Lưu thay đổi
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
