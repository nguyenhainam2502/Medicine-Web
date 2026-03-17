'use client';

import { useTransition } from 'react';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteProductButton({ productId, productName, deleteAction }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Xác nhận xóa thuốc: "${productName}"?`)) return;
    const formData = new FormData();
    formData.set('id', productId);
    startTransition(() => deleteAction(formData));
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[16px]">
        {isPending ? 'progress_activity' : 'delete'}
      </span>
      {isPending ? 'Đang xóa...' : 'Xóa'}
    </button>
  );
}

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteCategoryButton({ categoryId, categoryName, deleteAction }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Xóa danh mục: "${categoryName}"?\nCác thuốc thuộc danh mục này sẽ bị mất liên kết.`)) return;
    const formData = new FormData();
    formData.set('id', categoryId);
    startTransition(() => deleteAction(formData));
  }

  return (
    <button type="button" onClick={handleDelete} disabled={isPending}
      className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300 transition-colors disabled:opacity-50">
      <span className="material-symbols-outlined text-[16px]">{isPending ? 'progress_activity' : 'delete'}</span>
      {isPending ? '...' : 'Xóa'}
    </button>
  );
}

interface DeleteNewsButtonProps {
  newsId: string;
  newsTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteNewsButton({ newsId, newsTitle, deleteAction }: DeleteNewsButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Xóa bài viết: "${newsTitle}"?`)) return;
    const formData = new FormData();
    formData.set('id', newsId);
    startTransition(() => deleteAction(formData));
  }

  return (
    <button type="button" onClick={handleDelete} disabled={isPending}
      className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300 transition-colors disabled:opacity-50">
      <span className="material-symbols-outlined text-[16px]">{isPending ? 'progress_activity' : 'delete'}</span>
      {isPending ? '...' : 'Xóa'}
    </button>
  );
}
