import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: articles } = await supabase.from('news').select('*').eq('id', id).eq('published', true);
  const article = articles?.[0];
  if (!article) notFound();

  // Tin liên quan
  const { data: related } = await supabase.from('news').select('*').eq('published', true).neq('id', id).limit(3);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-medium mb-8">
        <a href="/" className="text-slate-500 hover:text-[#2b8cee] flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
        </a>
        <span className="text-slate-300">/</span>
        <a href="/news" className="text-slate-500 hover:text-[#2b8cee]">Tin Tức Y Tế</a>
        <span className="text-slate-300">/</span>
        <span className="text-[#2b8cee] font-bold line-clamp-1 max-w-xs">{article.title}</span>
      </nav>

      {/* Article */}
      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {article.image_url && (
          <div className="h-72 overflow-hidden">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8 md:p-12">
          <p className="text-[#2b8cee] text-xs font-bold uppercase tracking-wider mb-4">
            Tin Tức Y Tế · {new Date(article.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{article.title}</h1>
          {article.summary && (
            <p className="text-lg text-slate-500 mb-8 pb-8 border-b border-slate-100 leading-relaxed font-medium italic">
              {article.summary}
            </p>
          )}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
            {article.content}
          </div>
          {article.author && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2b8cee]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2b8cee] text-[20px]">person</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Tác giả</p>
                <p className="font-bold text-slate-900">{article.author}</p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {related && related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Tin tức liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r: any) => (
              <a key={r.id} href={`/news/${r.id}`} className="group bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all overflow-hidden">
                <div className="h-36 bg-slate-100 overflow-hidden">
                  {r.image_url
                    ? <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-4xl text-slate-300">newspaper</span></div>
                  }
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 line-clamp-2 text-sm group-hover:text-[#2b8cee] transition-colors">{r.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <a href="/news" className="flex items-center gap-2 text-slate-500 hover:text-[#2b8cee] font-medium transition-colors text-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>Quay lại danh sách tin
        </a>
      </div>
    </div>
  );
}
