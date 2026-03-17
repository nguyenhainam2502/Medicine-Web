-- Tạo bảng news (tin tức y tế)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    author TEXT DEFAULT 'MedAI Pro',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index tìm kiếm
CREATE INDEX IF NOT EXISTS idx_news_title ON public.news USING GIN (to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);

-- RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Mọi người đều đọc được tin đã published
CREATE POLICY "Public can read published news" ON public.news
    FOR SELECT USING (published = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()));
