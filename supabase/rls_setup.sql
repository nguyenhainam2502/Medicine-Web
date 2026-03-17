-- Enable RLS for all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_product ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for all tables
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access on diseases" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on disease_product" ON public.disease_product FOR SELECT USING (true);
