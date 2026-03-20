import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function SymptomCheck({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || '';
    let recommendations: any[] = [];
    let possibleDiseases: any[] = [];

    if (query) {
        // Tách từ khóa bằng dấu phẩy nếu user nhập nhiều (Giả lập NLP đơn giản)
        const keywords = query.split(',').map(k => k.trim()).filter(k => k.length > 0);

        // Tạo câu query mock: diseases.symptom_list ILIKE '%keyword1%' OR ILIKE '%keyword2%'
        let diseaseQuery = supabase.from('diseases').select('id, name, symptom_list');

        // Fetch tất cả rồi filter bằng JS cho MVP
        const { data: allDiseases } = await diseaseQuery;

        if (allDiseases) {
            // Tính điểm khớp triệu chứng cho từng bệnh
            const scoredDiseases = allDiseases.map((d: any) => {
                const list = d.symptom_list?.toLowerCase() || '';
                let score = 0;
                keywords.forEach(k => {
                    if (list.includes(k.toLowerCase())) score += 1;
                });
                return { ...d, score };
            });

            // Lọc ra các bệnh có điểm > 0 và sắp xếp theo điểm giảm dần
            possibleDiseases = scoredDiseases
                .filter(d => d.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3); // Lấy top 3 bệnh giống nhất
        }

        // Lấy danh sách thuốc từ các Bệnh tìm được
        if (possibleDiseases.length > 0) {
            const diseaseIds = possibleDiseases.map(d => d.id);

            // Query many-to-many qua bảng disease_product
            const { data: productLinks } = await supabase
                .from('disease_product')
                .select('products(*, categories(name))')
                .in('disease_id', diseaseIds);

            if (productLinks) {
                // Lọc trùng lặp thuốc và ưu tiên thuốc của bệnh có score cao nhất
                const uniqueProducts = new Map();
                productLinks.forEach((link: any) => {
                    if (link.products && !uniqueProducts.has(link.products.id)) {
                        uniqueProducts.set(link.products.id, link.products);
                    }
                });
                // Chỉ lấy tối đa 4 loại thuốc liên quan nhất để tránh dàn trải
                recommendations = Array.from(uniqueProducts.values()).slice(0, 4);
            }
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-10 animate-in fade-in duration-500">
            <a href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2b8cee] font-medium transition-colors mb-8">
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Về trang chủ
            </a>

            {/* Header AI Check (Stitch Style) */}
            <div className="bg-[#2b8cee] rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden flex flex-col items-center justify-center shadow-2xl mb-12">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-3xl">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white font-bold tracking-wider text-xs mb-6 border border-white/20 uppercase shadow-inner">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        Hệ thống Phân Tích Thông Minh
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.15]">Trợ Lý Y Tế AI</h1>
                    <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
                        Mô tả các triệu chứng lâm sàng bạn đang gặp phải. Hệ thống sẽ phân tích bệnh lý giả định và đưa ra thuốc tham khảo.
                    </p>

                    <form className="max-h-3xl mx-auto flex flex-col md:flex-row gap-4" method="GET" action="/symptom-check">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">stethoscope</span>
                            <input
                                name="q"
                                defaultValue={query}
                                type="text"
                                placeholder="VD: sốt cao, đau đầu, nghẹt mũi..."
                                className="w-full pl-14 pr-6 h-16 rounded-xl border border-transparent focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-lg text-slate-900 bg-white transition-all font-medium"
                            />
                        </div>
                        <button type="submit" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-10 h-16 rounded-xl font-bold hover:bg-slate-800 shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg flex-shrink-0">
                            Chẩn đoán
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </button>
                    </form>
                </div>
            </div>

            {query && (
                <div className="space-y-10">
                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex gap-5 shadow-sm items-start relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <div>
                            <h3 className="text-yellow-800 font-bold text-lg mb-2">Cảnh báo Y tế (Disclaimer)</h3>
                            <p className="text-yellow-700 leading-relaxed font-medium">
                                Các đề xuất dưới đây được sinh ra dựa trên thuật toán so khớp từ khóa. <b>Đây không phải là chẩn đoán y khoa chính thức từ bác sĩ.</b> Vui lòng luôn tham khảo ý kiến chuyên gia, dược sĩ trước khi mua và sử dụng bất kỳ loại thuốc nào!
                            </p>
                        </div>
                    </div>

                    {/* AI Diagnosis Result */}
                    {possibleDiseases.length > 0 ? (
                        <div className="space-y-10">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[#2b8cee] text-3xl">fact_check</span>
                                    <h2 className="text-2xl font-black text-slate-900">Bệnh lý tiềm ẩn tìm thấy:</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {possibleDiseases.map((d: any) => (
                                        <span key={d.id} className="inline-flex items-center gap-2 bg-[#2b8cee]/10 text-[#2b8cee] px-5 py-2.5 rounded-xl font-bold border border-[#2b8cee]/20 text-sm">
                                            <span className="material-symbols-outlined text-lg">coronavirus</span>
                                            {d.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="material-symbols-outlined text-[#2b8cee] text-4xl">local_pharmacy</span>
                                    <h2 className="text-3xl font-black text-slate-900">Phác đồ / Thuốc đề xuất</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {recommendations.map((p: any) => (
                                        <div key={p.id} className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex items-start gap-6 cursor-pointer">

                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img
                                                    src={`https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=80&seed=${p.id}`}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-[11px] font-black text-green-600 tracking-wider uppercase mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                    Phù hợp điều trị
                                                </span>
                                                <h3 className="text-xl font-black text-slate-900 mb-1 truncate">{p.name}</h3>
                                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">{p.description}</p>

                                                <a href={`/product/${p.id}`} className="inline-flex items-center gap-1 text-[#2b8cee] font-bold text-sm mt-auto group-hover:gap-2 transition-all w-fit">
                                                    Kiểm tra liều dùng <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">search_off</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Không tìm thấy bệnh lý khớp với mô tả</h3>
                            <p className="text-slate-500 font-medium">Hãy thử nhập các triệu chứng phổ biến hơn hoặc dùng từ khóa ngắn gọn, ví dụ: <br /> "Cảm cúm", "Đau đầu"...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
