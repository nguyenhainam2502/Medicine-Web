-- ============================================================
-- ADMIN SETUP - Chạy file này trên Supabase SQL Editor
-- ============================================================

-- 1. Tạo bảng profiles để lưu role của user
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kích hoạt RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User chỉ đọc được profile của chính họ
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admin/Staff có thể đọc tất cả profiles
CREATE POLICY "Admin/Staff can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

-- 2. Function tự động tạo profile khi user mới đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'role', 'staff'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger gọi function khi user mới được tạo
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Cập nhật RLS cho Products - cho phép admin/staff write
CREATE POLICY "Admin/Staff can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin/Staff can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin/Staff can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

-- 4. Cập nhật RLS cho Categories - cho phép admin/staff write
CREATE POLICY "Admin/Staff can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin/Staff can update categories" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin/Staff can delete categories" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
  );

-- ============================================================
-- SAU KHI CHẠY FILE NÀY, bạn cần:
-- 1. Vào Supabase Dashboard → Authentication → Users → Add user
-- 2. Tạo user: admin@medai.vn / password tùy chọn
-- 3. Lấy UUID của user vừa tạo và chạy lệnh sau:
--    INSERT INTO public.profiles (id, email, role) VALUES ('<UUID>', 'admin@medai.vn', 'admin');
-- ============================================================
