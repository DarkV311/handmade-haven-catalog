-- Add new settings for social media links
INSERT INTO public.settings (key, value, description) VALUES
('facebook_url', '', 'رابط صفحة الفيسبوك'),
('instagram_url', '', 'رابط صفحة الإنستغرام'),
('tiktok_url', '', 'رابط صفحة التيك توك'),
('telegram_url', '', 'رابط قناة التليجرام'),
('contact_address', '', 'عنوان الموقع أو المحل')
ON CONFLICT (key) DO NOTHING;