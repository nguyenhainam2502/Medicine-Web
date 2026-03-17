import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  const categoryFilter = params.category || '';

  const { data: categories } = await supabase.from('categories').select('*').order('name');

  let q = supabase.from('products').select('*, categories(name)').order('name');
  if (query) q = q.ilike('name', `%${query}%`);
  if (categoryFilter) q = q.eq('category_id', categoryFilter);
  const { data: products } = await q;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm font-medium mb-6">
          <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">home</span>Trang chủ
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-[#2b8cee] font-bold">Toàn bộ thuốc</span>
        </nav>
        <h1 className="text-4xl font-black text-slate-900">Toàn bộ Thuốc</h1>
        <p className="text-slate-500 mt-2">{products?.length ?? 0} sản phẩm trong hệ thống</p>
      </div>

      {/* Search + Filter */}
      <form className="flex flex-col sm:flex-row gap-4 mb-10" action="/products">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input name="q" defaultValue={query} type="text" placeholder="Tìm tên thuốc..."
            className="w-full pl-12 pr-6 h-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] text-slate-900 bg-white transition" />
        </div>
        <select name="category" defaultValue={categoryFilter}
          className="h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] text-slate-700 bg-white font-medium min-w-[200px]">
          <option value="">Tất cả danh mục</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="h-12 px-8 bg-[#2b8cee] text-white rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
          Tìm kiếm
        </button>
      </form>

      {/* Grid */}
      {products?.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
          <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">search_off</span>
          <p className="text-slate-500 font-bold text-xl">Không tìm thấy thuốc nào.</p>
          <a href="/products" className="mt-6 inline-flex items-center gap-2 text-[#2b8cee] font-bold hover:underline">
            Xem tất cả thuốc
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((p: any) => (
            <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name}
                  src={p.image_url || `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&q=80`} />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#2b8cee] px-2 py-1 rounded bg-[#2b8cee]/10 max-w-[70%] truncate">
                    {p.categories?.name}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                    <span className="text-xs font-bold ml-1">4.9</span>
                  </div>
                </div>
                <h5 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">{p.name}</h5>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{p.description}</p>
                <a href={`/product/${p.id}`} className="w-full mt-auto py-2.5 rounded-lg border-2 border-[#2b8cee]/20 text-[#2b8cee] font-bold text-sm hover:bg-[#2b8cee] hover:text-white transition-colors text-center block">
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
