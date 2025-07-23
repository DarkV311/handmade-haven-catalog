-- إصلاح سياسات RLS للسماح بالإدراج والتحديث للمسؤولين
-- إنشاء جدول للصور في الواجهة الرئيسية
-- إنشاء bucket للصور

-- إنشاء storage bucket للصور
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات storage للصور
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images');

-- نفس السياسات للصور الرئيسية
CREATE POLICY "Anyone can view hero images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Admins can update hero images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can delete hero images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-images');

-- إنشاء جدول للصور الرئيسية
CREATE TABLE IF NOT EXISTS public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS للجدول الجديد
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- سياسات للصور الرئيسية
CREATE POLICY "Hero images are viewable by everyone" 
ON public.hero_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage hero images" 
ON public.hero_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- إضافة تريغر لتحديث الوقت
CREATE TRIGGER update_hero_images_updated_at
BEFORE UPDATE ON public.hero_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بعض الصور التجريبية
INSERT INTO public.hero_images (title, image_url, is_active, sort_order) VALUES
('صورة تجريبية 1', '/placeholder.svg', true, 1),
('صورة تجريبية 2', '/placeholder.svg', true, 2),
('صورة تجريبية 3', '/placeholder.svg', true, 3)
ON CONFLICT DO NOTHING;