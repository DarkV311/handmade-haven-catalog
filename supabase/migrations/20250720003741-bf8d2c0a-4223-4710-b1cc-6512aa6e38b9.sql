-- Create tables for admin dashboard
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_currency TEXT DEFAULT 'ج.م',
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Settings are viewable by everyone" 
ON public.settings FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
('البصمات الخشب والأكليريك', 'wooden-stamps', 'Stamp', 1),
('أشكال المباخر', 'incense-burners', 'Flame', 2),
('أشكال أرقام الساعات', 'clock-numbers', 'Clock', 3),
('آيات قرآنية وديكور', 'quran-decor', 'BookOpen', 4),
('مستلزمات البصمات', 'stamp-supplies', 'Package', 5),
('مستلزمات الهاند ميد', 'handmade-supplies', 'Palette', 6);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('contact_phone', '01004119595', 'رقم التواصل'),
('whatsapp_number', '201004119595', 'رقم الواتساب'),
('site_title', 'كتالوج المنتجات اليدوية', 'عنوان الموقع'),
('site_description', 'اكتشف أجمل التصاميم والمنتجات المصنوعة يدوياً', 'وصف الموقع'),
('hero_title', 'مباخر تراثية أنيقة', 'عنوان البانر'),
('hero_subtitle', 'روائح عطرة وتصاميم كلاسيكية تجمع بين الأصالة والحداثة', 'نص البانر'),
('hero_button_text', 'تصفح المنتجات', 'نص زر البانر');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();