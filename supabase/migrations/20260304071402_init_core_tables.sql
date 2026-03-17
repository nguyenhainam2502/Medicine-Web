-- Bật pgcrypto để dùng hàm gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Bảng Danh Mục
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Thuốc (Sản Phẩm)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    usage TEXT,           -- Công dụng
    side_effect TEXT,     -- Tác dụng phụ
    dosage TEXT,          -- Liều dùng
    warning TEXT,         -- Cảnh báo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Triệu chứng
CREATE TABLE public.symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng Bệnh lý
CREATE TABLE public.diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    symptom_list TEXT,    -- Chuỗi danh sách triệu chứng cơ bản
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng liên kết Bệnh & Thuốc (Many-to-Many)
CREATE TABLE public.disease_product (
    disease_id UUID REFERENCES public.diseases(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (disease_id, product_id)
);

-- Tạo Index để tối ưu Performance (Tìm kiếm Text)
CREATE INDEX idx_products_name ON public.products USING GIN (to_tsvector('simple', name));
CREATE INDEX idx_products_category ON public.products(category_id);
