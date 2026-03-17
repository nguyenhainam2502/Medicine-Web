import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Tắt cache để luôn lấy data mới nhất trong lúc DEV

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  // Lấy Categories
  const { data: categories } = await supabase.from('categories').select('*');

  // Lấy 8 sản phẩm mới nhất hoặc tìm kiếm
  let productQuery = supabase.from('products').select('*, categories(name)').limit(8);
  if (query) {
    productQuery = productQuery.ilike('name', `%${query}%`);
  }
  const { data: products } = await productQuery;

  return (
    <div className="w-full">
      {/* Hero Section (Stitch Style) */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column Text/Search */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b8cee]/10 text-[#2b8cee] text-xs font-bold w-fit uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2b8cee] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2b8cee]"></span>
              </span>
              Hệ thống tra cứu tự động cập nhật
            </div>

            <h1 className="text-slate-900 text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Tra Cứu Thuốc, <br /><span className="text-[#2b8cee]">Nhanh Khắp Mọi Nơi</span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-lg">
              Tra cứu đầy đủ thông tin y tế, chỉ định, chống chỉ định và liều dùng chuẩn xác từ ngân hàng dược phẩm uy tín.
            </p>

            <form className="flex flex-col sm:flex-row gap-4" action="/">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  name="q"
                  defaultValue={query}
                  type="text"
                  placeholder="Tìm tên thuốc (Paracetamol...)"
                  className="w-full pl-12 pr-6 h-14 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] shadow-sm text-base text-slate-900 bg-white/50 focus:bg-white transition-colors"
                />
              </div>
              <button type="submit" className="flex min-w-[140px] items-center justify-center rounded-xl h-14 px-8 bg-[#2b8cee] text-white text-base font-bold shadow-xl shadow-[#2b8cee]/30 hover:scale-[1.02] transition-transform">
                Tra cứu
              </button>
            </form>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img className="h-10 w-10 object-cover rounded-full border-2 border-white" alt="Doctor" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" />
                <img className="h-10 w-10 object-cover rounded-full border-2 border-white" alt="Doctor" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" />
                <img className="h-10 w-10 object-cover rounded-full border-2 border-white" alt="Pharmacist" src="https://images.unsplash.com/photo-1537368910025-7028dd906d3e?w=100&h=100&fit=crop" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Tham chiếu từ 10.000+ chuyên gia</p>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#2b8cee]/5 rounded-full blur-3xl"></div>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] relative shadow-2xl">
              <img className="w-full h-full object-cover" alt="Doctor holding tablet" src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=1000&fit=crop" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl border border-white/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <span className="material-symbols-outlined text-green-600">verified_user</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cơ sở dữ liệu</p>
                    <p className="text-sm font-bold text-slate-900">Liên tục cập nhật 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories (Services Section Style) */}
      <section id="categories" className="bg-slate-50 py-20 px-6 border-y border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-[#2b8cee] text-sm font-extrabold uppercase tracking-[0.2em]">Danh mục Y Khoa</h2>
            <h3 className="text-slate-900 text-3xl md:text-4xl font-black">Khám phá theo Chuyên Khoa</h3>
            <p className="text-slate-600 max-w-2xl">Mọi nhóm thuốc bạn cần đều được tổ chức khoa học, dễ hiểu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories?.map((c: any) => (
              <a key={c.id} href={`/category/${c.id}`} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#2b8cee]/50 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-xl bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee] mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">vaccines</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{c.name}</h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Doctors Section Style) */}
      <section className="py-20 px-6 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-[#2b8cee] text-sm font-extrabold uppercase tracking-[0.2em]">{query ? 'Kết quả tìm kiếm' : 'Sản phẩm mới'}</h2>
            <h3 className="text-slate-900 text-3xl md:text-4xl font-black">{query ? `Tìm kiếm: "${query}"` : 'Thuốc Nổi Bật'}</h3>
          </div>
          {!query && (
            <a href="/products" className="flex items-center gap-2 text-[#2b8cee] font-bold hover:gap-3 transition-all">
            Xem toàn bộ thuốc <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          )}
        </div>

        {products?.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <span className="text-6xl mb-6 block opacity-50">📂</span>
            <p className="text-slate-500 text-xl font-bold">Chưa tìm thấy dữ liệu về thuốc này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((p: any) => (
              <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all flex flex-col h-full">
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={p.name}
                    src={p.image_url || `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&q=80`}
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2b8cee] px-2 py-1 rounded bg-[#2b8cee]/10 max-w-[70%] truncate">{p.categories?.name}</span>
                    <div className="flex items-center text-yellow-500">
                      <span className="material-symbols-outlined text-sm fill-1">star</span>
                      <span className="text-xs font-bold ml-1">4.9</span>
                    </div>
                  </div>
                  <h5 className="text-lg font-bold text-slate-900 line-clamp-2 md:line-clamp-1 mb-2">{p.name}</h5>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{p.description}</p>
                  <a href={`/product/${p.id}`} className="w-full mt-auto py-2.5 rounded-lg border-2 border-[#2b8cee]/20 text-[#2b8cee] font-bold text-sm hover:bg-[#2b8cee] hover:text-white transition-colors text-center block">
                    Xem chi tiết
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
