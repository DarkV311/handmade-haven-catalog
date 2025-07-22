-- إضافة سياسات INSERT و UPDATE للجداول المطلوبة
-- سياسات المنتجات
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- سياسات الأقسام
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE USING (true);

-- سياسات الإعدادات
CREATE POLICY "Anyone can insert settings" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete settings" ON public.settings FOR DELETE USING (true);

-- سياسات الألوان
CREATE POLICY "Anyone can insert colors" ON public.colors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update colors" ON public.colors FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete colors" ON public.colors FOR DELETE USING (true);

-- سياسات المقاسات
CREATE POLICY "Anyone can insert sizes" ON public.sizes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sizes" ON public.sizes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sizes" ON public.sizes FOR DELETE USING (true);

-- سياسات متغيرات المنتجات
CREATE POLICY "Anyone can insert product variants" ON public.product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product variants" ON public.product_variants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product variants" ON public.product_variants FOR DELETE USING (true);

-- حذف جداول الطلبات لأنها غير مطلوبة
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- إضافة بيانات اختبارية للألوان والمقاسات والأقسام
INSERT INTO public.colors (name, hex_code, is_active, sort_order) VALUES
('أحمر', '#FF0000', true, 1),
('أزرق', '#0000FF', true, 2),
('أخضر', '#00FF00', true, 3),
('أسود', '#000000', true, 4),
('أبيض', '#FFFFFF', true, 5),
('بني', '#8B4513', true, 6),
('ذهبي', '#FFD700', true, 7);

INSERT INTO public.sizes (name, display_name, is_active, sort_order) VALUES
('small', 'صغير', true, 1),
('medium', 'متوسط', true, 2),
('large', 'كبير', true, 3),
('xl', 'كبير جداً', true, 4),
('custom', 'مقاس مخصص', true, 5);

-- إضافة إعدادات افتراضية
INSERT INTO public.settings (key, value, description) VALUES
('site_title', 'كتالوج المنتجات اليدوية', 'عنوان الموقع'),
('site_description', 'اكتشف مجموعة رائعة من المنتجات اليدوية المصنوعة بعناية فائقة', 'وصف الموقع'),
('hero_title', 'مرحباً بك في عالم الحرف اليدوية', 'عنوان البانر الرئيسي'),
('hero_subtitle', 'نقدم لك أجمل المنتجات المصنوعة يدوياً بجودة عالية وتصاميم فريدة', 'وصف البانر الرئيسي'),
('contact_whatsapp', '01004119595', 'رقم الواتساب'),
('contact_phone', '01004119595', 'رقم الهاتف'),
('facebook_url', 'https://facebook.com', 'رابط الفيسبوك'),
('instagram_url', 'https://instagram.com', 'رابط الإنستجرام');

-- إضافة منتجات تجريبية
INSERT INTO public.products (name, description, price, image_url, category_id, is_active, has_variants, base_quantity) VALUES
('ساعة خشبية عربية', 'ساعة حائط خشبية مع أرقام عربية تقليدية، مصنوعة من الخشب الطبيعي', 150, '/src/assets/clock-numbers-1.jpg', (SELECT id FROM categories WHERE name = 'خشبيات' LIMIT 1), true, true, 10),
('مبخرة نحاسية', 'مبخرة تقليدية مصنوعة من النحاس الأصلي مع نقوش يدوية', 85, '/src/assets/incense-burner-1.jpg', (SELECT id FROM categories WHERE name = 'معادن' LIMIT 1), true, false, 5),
('ختم خشبي مخصص', 'ختم شخصي مصنوع من الخشب الطبيعي، يمكن نقش أي تصميم عليه', 45, '/src/assets/wooden-stamp-1.jpg', (SELECT id FROM categories WHERE name = 'خشبيات' LIMIT 1), true, true, 15);