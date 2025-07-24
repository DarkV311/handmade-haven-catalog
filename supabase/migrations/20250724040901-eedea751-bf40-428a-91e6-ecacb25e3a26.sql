-- Add new settings for copyright, WhatsApp, and TikTok
INSERT INTO public.settings (key, value, description) VALUES
('site_title', '', 'عنوان الموقع الرئيسي'),
('copyright_text', '', 'نص حقوق الملكية'),
('whatsapp_url', '', 'رابط الواتساب'),
('tiktok_url', '', 'رابط التيك توك')
ON CONFLICT (key) DO NOTHING;