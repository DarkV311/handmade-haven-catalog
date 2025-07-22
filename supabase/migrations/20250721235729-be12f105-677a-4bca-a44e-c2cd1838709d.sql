-- إضافة جداول جديدة لنظام إدارة شامل

-- جدول الألوان المتاحة
CREATE TABLE public.colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hex_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول المقاسات المتاحة
CREATE TABLE public.sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول متغيرات المنتجات (الألوان والمقاسات)
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES public.colors(id) ON DELETE CASCADE,
  size_id UUID REFERENCES public.sizes(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  additional_price NUMERIC DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, color_id, size_id)
);

-- جدول الطلبات
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول عناصر الطلبات
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول رسائل التواصل
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول إحصائيات الزيارات
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  visit_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول مشاهدات المنتجات
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  view_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول للبيانات العامة (قراءة فقط)
CREATE POLICY "Colors are viewable by everyone" ON public.colors FOR SELECT USING (is_active = true);
CREATE POLICY "Sizes are viewable by everyone" ON public.sizes FOR SELECT USING (is_active = true);
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (is_available = true);
CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Order items are viewable by everyone" ON public.order_items FOR SELECT USING (true);

-- سياسات إدراج الطلبات والرسائل (للزوار)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create visitor stats" ON public.visitor_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create product views" ON public.product_views FOR INSERT WITH CHECK (true);

-- إضافة triggers للتحديث التلقائي
CREATE TRIGGER update_colors_updated_at BEFORE UPDATE ON public.colors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sizes_updated_at BEFORE UPDATE ON public.sizes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بيانات أولية للألوان
INSERT INTO public.colors (name, hex_code, sort_order) VALUES
('أبيض', '#FFFFFF', 1),
('أسود', '#000000', 2),
('أحمر', '#FF0000', 3),
('أزرق', '#0000FF', 4),
('أخضر', '#008000', 5),
('أصفر', '#FFFF00', 6),
('بني', '#8B4513', 7),
('رمادي', '#808080', 8);

-- إدراج بيانات أولية للمقاسات
INSERT INTO public.sizes (name, display_name, sort_order) VALUES
('small', 'صغير', 1),
('medium', 'متوسط', 2),
('large', 'كبير', 3),
('extra_large', 'كبير جداً', 4),
('custom', 'مقاس خاص', 5);

-- إضافة أعمدة جديدة لجدول المنتجات
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS base_quantity INTEGER DEFAULT 0;