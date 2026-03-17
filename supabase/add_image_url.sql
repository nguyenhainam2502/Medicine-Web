-- Thêm cột image_url vào bảng products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_url TEXT;
