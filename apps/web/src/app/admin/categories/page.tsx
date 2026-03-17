import { createServerClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { DeleteCategoryButton } from '@/components/AdminDeleteButtons';

async function createCategory(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const name = formData.get('name') as string;
  if (name?.trim()) await supabase.from('categories').insert({ name: name.trim() });
  redirect('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  const { createAdminClient } = await import('@/lib/supabase');
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  await supabase.from('categories').delete().eq('id', id);
  redirect('/admin/categories');
}

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('name');

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Quản lý Danh mục</h1>
        <p className="text-slate-500 text-sm mt-1">{categories?.length ?? 0} chuyên khoa trong hệ thống</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2b8cee]">add_box</span>
          Thêm danh mục mới
        </h2>
        <form action={createCategory} className="flex gap-3">
          <input name="name" required placeholder="VD: Thuốc Da Liễu"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2b8cee] font-medium text-slate-900 bg-slate-50 focus:bg-white transition" />
          <button type="submit" className="flex items-center gap-2 bg-[#2b8cee] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2070c5] transition-colors shadow-md flex-shrink-0">
            <span className="material-symbols-outlined">add</span>Thêm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 bg-slate-50">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Danh sách danh mục</p>
        </div>
        <ul className="divide-y divide-slate-100">
          {categories?.map((c: any) => (
            <li key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2b8cee]/10 text-[#2b8cee] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">vaccines</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.products?.[0]?.count ?? 0} sản phẩm</p>
                </div>
              </div>
              <DeleteCategoryButton categoryId={c.id} categoryName={c.name} deleteAction={deleteCategory} />
            </li>
          ))}
        </ul>
        {categories?.length === 0 && (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">folder_off</span>
            <p className="text-slate-500 font-medium">Chưa có danh mục nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
