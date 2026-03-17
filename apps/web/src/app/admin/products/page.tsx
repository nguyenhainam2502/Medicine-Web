import { createServerClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { DeleteProductButton } from '@/components/AdminDeleteButtons';

async function deleteProduct(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  await supabase.from('products').delete().eq('id', id);
  redirect('/admin/products');
}

export default async function AdminProductsPage() {
  const supabase = await createServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Quản lý Thuốc</h1>
          <p className="text-slate-500 text-sm mt-1">{products?.length ?? 0} sản phẩm trong hệ thống</p>
        </div>
        <a href="/admin/products/new" className="flex items-center gap-2 bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md">
          <span className="material-symbols-outlined">add</span>
          Thêm thuốc mới
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Tên thuốc</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">Ảnh</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products?.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs font-bold text-[#2b8cee] px-2 py-1 bg-[#2b8cee]/10 rounded-lg">
                    {p.categories?.name ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                    : <span className="text-xs text-slate-400 italic">Chưa có ảnh</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <a href={`/admin/products/${p.id}/edit`} className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#2b8cee] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#2b8cee]/30 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">edit</span>Sửa
                    </a>
                    <DeleteProductButton productId={p.id} productName={p.name} deleteAction={deleteProduct} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products?.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">medication_liquid</span>
            <p className="text-slate-500 font-medium">Chưa có thuốc nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
