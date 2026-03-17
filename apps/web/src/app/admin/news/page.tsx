import { createServerClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { DeleteNewsButton } from '@/components/AdminDeleteButtons';

async function togglePublish(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const current = formData.get('published') === 'true';
  await supabase.from('news').update({ published: !current }).eq('id', id);
  redirect('/admin/news');
}

async function deleteNews(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  await supabase.from('news').delete().eq('id', id);
  redirect('/admin/news');
}

export default async function AdminNewsPage() {
  const supabase = await createServerClient();
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Quản lý Tin Tức</h1>
          <p className="text-slate-500 text-sm mt-1">{news?.length ?? 0} bài viết trong hệ thống</p>
        </div>
        <a href="/admin/news/new" className="flex items-center gap-2 bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
          <span className="material-symbols-outlined">add</span>
          Thêm tin mới
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Tác giả</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news?.map((article: any) => (
              <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{article.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(article.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm text-slate-600">{article.author}</span>
                </td>
                <td className="px-6 py-4">
                  <form action={togglePublish}>
                    <input type="hidden" name="id" value={article.id} />
                    <input type="hidden" name="published" value={String(article.published)} />
                    <button type="submit" className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                      article.published
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}>
                      {article.published ? '✅ Đã đăng' : '⏳ Nháp'}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <a href={`/admin/news/${article.id}/edit`}
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#2b8cee] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#2b8cee]/30 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">edit</span>Sửa
                    </a>
                    <DeleteNewsButton newsId={article.id} newsTitle={article.title} deleteAction={deleteNews} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!news || news.length === 0) && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">newspaper</span>
            <p className="text-slate-500 font-medium">Chưa có bài viết nào. Hãy thêm tin đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
}
