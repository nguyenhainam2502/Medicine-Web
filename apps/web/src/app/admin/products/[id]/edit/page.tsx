import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

async function updateProduct(formData: FormData) {
    'use server';
    const { createAdminClient } = await import('@/lib/supabase');
    const supabase = createAdminClient();
    const id = formData.get('id') as string;

    const imageUrl = formData.get('image_url') as string;
    const data = {
        name: formData.get('name') as string,
        category_id: formData.get('category_id') as string || null,
        image_url: imageUrl?.trim() || null,
        description: formData.get('description') as string,
        usage: formData.get('usage') as string,
        dosage: formData.get('dosage') as string,
        side_effect: formData.get('side_effect') as string,
        warning: formData.get('warning') as string,
    };

    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (error) redirect(`/admin/products/${id}/edit?error=${encodeURIComponent(error.message)}`);
    redirect('/admin/products');
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: products } = await supabase.from('products').select('*, categories(name)').eq('id', id);
    const product = products?.[0];
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    if (!product) redirect('/admin/products');

    return (
        <div className="p-8 max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <a href="/admin/products" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Danh sách thuốc
                </a>
                <span className="text-slate-300">/</span>
                <h1 className="text-xl font-black text-slate-900">Sửa thông tin thuốc</h1>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <form action={updateProduct} className="space-y-6">
                    <input type="hidden" name="id" value={product.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tên thuốc *</label>
                            <input name="name" required defaultValue={product.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Danh mục</label>
                            <select name="category_id" defaultValue={product.category_id ?? ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition">
                                <option value="">-- Chọn danh mục --</option>
                                {categories?.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">🖼️ URL Ảnh thuốc</label>
                            {product.image_url && (
                                <div className="mb-3 rounded-xl overflow-hidden h-32 bg-slate-100">
                                    <img src={product.image_url} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input name="image_url" type="text" defaultValue={product.image_url ?? ''} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
                            <p className="text-xs text-slate-400 mt-1">Dán link ảnh trực tiếp (Google Images, Imgur, ...). Để trống sẽ dùng ảnh mặc định.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả thuốc</label>
                            <textarea name="description" rows={3} defaultValue={product.description} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-green-700 mb-2">✅ Công dụng</label>
                            <textarea name="usage" rows={4} defaultValue={product.usage} className="w-full px-4 py-3 rounded-xl border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-slate-900 bg-green-50/30 focus:bg-white transition resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#2b8cee] mb-2">🕐 Liều dùng</label>
                            <textarea name="dosage" rows={4} defaultValue={product.dosage} className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-blue-50/30 focus:bg-white transition resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-orange-600 mb-2">⚠️ Tác dụng phụ</label>
                            <textarea name="side_effect" rows={4} defaultValue={product.side_effect} className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium text-slate-900 bg-orange-50/30 focus:bg-white transition resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-red-600 mb-2">🚨 Cảnh báo</label>
                            <textarea name="warning" rows={4} defaultValue={product.warning} className="w-full px-4 py-3 rounded-xl border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium text-slate-900 bg-red-50/30 focus:bg-white transition resize-none" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button type="submit" className="flex items-center gap-2 bg-[#2b8cee] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
                            <span className="material-symbols-outlined">save</span>
                            Lưu thay đổi
                        </button>
                        <a href="/admin/products" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                            Hủy bỏ
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
