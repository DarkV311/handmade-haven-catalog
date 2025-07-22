-- حذف البيانات المكررة والناقصة
DELETE FROM public.settings WHERE key IN ('site_title', 'site_description', 'hero_title', 'hero_subtitle', 'contact_whatsapp', 'contact_phone', 'facebook_url', 'instagram_url');

-- إضافة البيانات بشكل صحيح
INSERT INTO public.settings (key, value, description) VALUES
('site_title', 'كتالوج المنتجات اليدوية', 'عنوان الموقع'),
('site_description', 'اكتشف مجموعة رائعة من المنتجات اليدوية المصنوعة بعناية فائقة', 'وصف الموقع'),
('hero_title', 'مرحباً بك في عالم الحرف اليدوية', 'عنوان البانر الرئيسي'),
('hero_subtitle', 'نقدم لك أجمل المنتجات المصنوعة يدوياً بجودة عالية وتصاميم فريدة', 'وصف البانر الرئيسي'),
('contact_whatsapp', '01004119595', 'رقم الواتساب'),
('contact_phone', '01004119595', 'رقم الهاتف'),
('facebook_url', 'https://facebook.com', 'رابط الفيسبوك'),
('instagram_url', 'https://instagram.com', 'رابط الإنستجرام');

-- إنشاء جدول المستخدمين الإداريين
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS على جدول المستخدمين الإداريين
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- سياسة للمصادقة
CREATE POLICY "Admin authentication access" ON public.admin_users FOR SELECT USING (true);

-- إضافة مستخدم إداري افتراضي (username: admin, password: admin)
-- كلمة المرور مشفرة باستخدام bcrypt
INSERT INTO public.admin_users (username, password_hash) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- إضافة trigger للتحديث التلقائي للوقت
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();