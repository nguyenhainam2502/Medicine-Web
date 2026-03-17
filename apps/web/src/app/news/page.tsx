import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';

  let q = supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
  if (query) q = q.ilike('title', `%${query}%`);
  const { data: news } = await q;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm font-medium mb-6">
          <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-[#2b8cee] font-bold">Tin Tức Y Tế</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[#2b8cee] text-xs font-extrabold uppercase tracking-[0.2em] mb-2">Cập nhật mới nhất</p>
            <h1 className="text-4xl font-black text-slate-900">Tin Tức Y Tế</h1>
            <p className="text-slate-500 mt-2">Thông tin y tế, dược phẩm và sức khỏe cộng đồng chính xác.</p>
          </div>

          <form action="/news" className="flex gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input name="q" defaultValue={query} placeholder="Tìm tin tức..."
                className="pl-10 pr-4 h-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] text-slate-900 bg-white w-60 transition" />
            </div>
            <button type="submit" className="h-11 px-6 bg-[#2b8cee] text-white rounded-xl font-bold hover:bg-[#2070c5] transition-colors">
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* News Grid */}
      {!news || news.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200">
          <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">newspaper</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có tin tức nào</h3>
          <p className="text-slate-500">Các bài viết mới sẽ được cập nhật sớm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article: any) => (
            <a key={article.id} href={`/news/${article.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all flex flex-col">
              <div className="h-52 overflow-hidden bg-slate-100">
                {article.image_url
                  ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2b8cee]/5">
                      <span className="material-symbols-outlined text-6xl text-[#2b8cee]/30">newspaper</span>
                    </div>
                  )
                }
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-slate-400 font-medium mb-2">
                  {new Date(article.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  {article.author && <span> · {article.author}</span>}
                </p>
                <h3 className="text-lg font-black text-slate-900 line-clamp-2 mb-3 group-hover:text-[#2b8cee] transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 flex-1">{article.summary}</p>
                <div className="mt-4 flex items-center gap-1 text-[#2b8cee] font-bold text-sm">
                  Đọc thêm <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
