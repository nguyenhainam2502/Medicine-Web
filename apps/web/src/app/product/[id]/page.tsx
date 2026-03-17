import { supabase } from '@/lib/supabase';
import AddToOrderButton from '@/components/AddToOrderButton';

export const revalidate = 3600; // Cache trang này 1 TIẾNG, giúp Server gánh tải 10k CCU nhẹ nhàng.

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Sửa lỗi PGROUTINE .single() bằng cách lấy mảng và lấy phần tử đầu tiên
    const { data: products } = await supabase.from('products').select('*, categories(name)').eq('id', id);
    const product = products?.[0] as any;

    if (!product) {
        return (
            <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-slate-400">medication</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Không tìm thấy thuốc</h1>
                <p className="text-slate-500 mb-8">Thông tin sản phẩm đã bị gỡ hoặc đường dẫn không chính xác.</p>
                <a href="/" className="inline-flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2070c5] transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Quay lại trang chủ
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-10 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium mb-10">
                <a href="/" className="text-slate-500 hover:text-[#2b8cee] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    Trang chủ
                </a>
                <span className="text-slate-300">/</span>
                <a href={`/category/${product.category_id}`} className="text-slate-500 hover:text-[#2b8cee] transition-colors">
                    {product.categories?.name}
                </a>
                <span className="text-slate-300">/</span>
                <span className="text-[#2b8cee] font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
            </nav>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Product Heading (Stitch Style) */}
                <div className="relative bg-slate-50 p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Image Wrapper */}
                    <div className="w-full md:w-64 h-64 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-shrink-0 relative group">
                        <img
                            src={`https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop&q=80&seed=${product.id}`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left z-10 w-full">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2b8cee]/10 text-[#2b8cee] font-bold text-xs tracking-wide rounded-lg mb-4 uppercase border border-[#2b8cee]/20">
                            <span className="material-symbols-outlined text-[16px]">category</span>
                            {product.categories?.name}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">{product.name}</h1>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">{product.description}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <AddToOrderButton 
                                productId={product.id} 
                                productName={product.name} 
                                imageUrl={product.image_url} 
                                category={product.categories?.name} 
                            />
                            <button className="flex items-center justify-center gap-2 rounded-xl h-14 px-8 border-2 border-slate-200 text-slate-700 text-base font-bold hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined">share</span>
                                Chia sẻ thuốc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details Grid */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Usage */}
                    <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 hover:shadow-md transition-all flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl">healing</span>
                            </div>
                            <h3 className="text-green-800 font-bold text-xl">Công dụng điều trị</h3>
                        </div>
                        <p className="text-green-900/80 leading-relaxed font-medium">{product.usage || 'Chưa cập nhật dữ liệu dược lý.'}</p>
                    </div>

                    {/* Side Effects */}
                    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 hover:shadow-md transition-all flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl">sick</span>
                            </div>
                            <h3 className="text-orange-800 font-bold text-xl">Tác dụng phụ (ADR)</h3>
                        </div>
                        <p className="text-orange-900/80 leading-relaxed font-medium">{product.side_effect || 'Chưa ghi nhận phản ứng phụ nghiêm trọng.'}</p>
                    </div>

                    {/* Dosage */}
                    <div className="bg-[#2b8cee]/5 rounded-2xl p-6 border border-[#2b8cee]/10 hover:shadow-md transition-all flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#2b8cee]/10 text-[#2b8cee] flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl">schedule</span>
                            </div>
                            <h3 className="text-[#2b8cee] font-bold text-xl">Liều dùng & Định lượng</h3>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">{product.dosage || 'Vui lòng tham khảo ý kiến bác sĩ.'}</p>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-200 hover:shadow-md transition-all relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-2xl">warning</span>
                            </div>
                            <h3 className="text-red-800 font-bold text-xl">Cảnh báo Y Khoa</h3>
                        </div>
                        <p className="text-red-900 leading-relaxed font-medium relative z-10">
                            {product.warning || 'Không có cảnh báo đặc biệt. Tránh xa tầm tay trẻ em.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
