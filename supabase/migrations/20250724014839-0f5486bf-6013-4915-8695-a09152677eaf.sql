-- Create table for tracking product inquiries
CREATE TABLE public.product_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  inquiry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create product inquiries" 
ON public.product_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view product inquiries" 
ON public.product_inquiries 
FOR SELECT 
USING (true);

-- Add index for better performance
CREATE INDEX idx_product_inquiries_product_id ON public.product_inquiries(product_id);
CREATE INDEX idx_product_inquiries_date ON public.product_inquiries(inquiry_date);

-- Add WhatsApp and TikTok settings
INSERT INTO public.settings (key, value, description) VALUES
('whatsapp_number', '201004119595', 'رقم الواتساب للتواصل'),
('tiktok_url', '', 'رابط صفحة التيك توك')
ON CONFLICT (key) DO NOTHING;