import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Tắt cache tuyệt đối để tránh lỗi 404

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Lấy thông tin Category (bỏ .single() để tránh throw error 406 nếu null)
    const { data: categories } = await supabase.from('categories').select('*').eq('id', id);
    const category = categories?.[0];

    // 2. Lấy danh sách thuốc
    let products: any[] = [];
    if (category) {
        const { data } = await supabase.from('products').select('*, categories(name)').eq('category_id', id);
        if (data) products = data;
    }

    if (!category) {
        return (
            <div className="w-full max-w-7xl mx-auto px-6 py-20 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-slate-400">category</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Không tìm thấy danh mục này</h1>
                <p className="text-slate-500 mb-8">Có thể danh mục đã bị xóa hoặc đường dẫn không chính xác.</p>
                <a href="/" className="inline-flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2070c5] transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Quay lại trang chủ
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium mb-10">
                <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    Trang chủ
                </a>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900">Danh mục</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#2b8cee] font-bold">{category.name}</span>
            </nav>

            {/* Category Header (Stitch Services Section Style) */}
            <div className="relative bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2b8cee]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="w-24 h-24 bg-[#2b8cee]/10 text-[#2b8cee] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner z-10">
                    <span className="material-symbols-outlined text-5xl">medical_information</span>
                </div>
                <div className="z-10 text-center md:text-left">
                    <h2 className="text-[#2b8cee] text-xs font-extrabold uppercase tracking-[0.2em] mb-2">Chuyên Khoa</h2>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{category.name}</h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        Khám phá tất cả các loại thuốc, dược phẩm và thực phẩm chức năng thuộc chuyên khoa này.
                    </p>
                </div>
            </div>

            {/* Product List (Stitch Doctors Layout) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 text-2xl font-black">Danh sách Sản phẩm</h3>
                    <p className="text-slate-500 text-sm">Hiển thị {products.length} kết quả</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-16 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Danh mục đang trống</h3>
                    <p className="text-slate-500">Hiện tại chưa có thuốc nào được phân loại vào chuyên khoa này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p: any) => (
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
        </div>
    );
}
