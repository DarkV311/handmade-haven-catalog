import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  price_currency: string;
  image_url: string;
  category_id: string;
  description: string;
  additional_details?: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [productImages, setProductImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = products.find(p => p.id === id) as Product | undefined;
  const category = categories.find(c => c.id === product?.category_id);

  useEffect(() => {
    if (id) {
      // Track product view
      supabase
        .from('product_views')
        .insert([{
          product_id: id,
          visitor_ip: null
        }])
        .then(({ error }) => {
          if (error) console.error('Error tracking view:', error);
        });

      // Fetch product images
      supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .eq('is_active', true)
        .order('sort_order')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching images:', error);
          } else {
            setProductImages(data || []);
          }
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-xl">جاري التحميل...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-xl mb-4">المنتج غير موجود</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowRight className="ml-2" size={16} />
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(product.image_url ? [{ image_url: product.image_url, alt_text: product.name }] : []),
    ...productImages
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleWhatsApp = async () => {
    // Track product inquiry
    try {
      await supabase
        .from('product_inquiries')
        .insert([{
          product_id: product.id,
          visitor_ip: null
        }]);
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }

    const message = `السلام عليكم، أريد الاستفسار عن هذا المنتج:\n\n${product.name}\n${product.description}\nالسعر: ${product.price} ${product.price_currency}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201004119595?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-2"
          >
            <ArrowRight className="ml-2" size={16} />
            العودة للرئيسية
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>الرئيسية</span>
            <span>/</span>
            {category && (
              <>
                <span>{category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {allImages.length > 0 ? (
              <>
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <img 
                    src={allImages[currentImageIndex]?.image_url} 
                    alt={allImages[currentImageIndex]?.alt_text || product.name}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft size={20} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight size={20} />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded border cursor-pointer transition-all ${
                          currentImageIndex === index 
                            ? 'border-primary ring-2 ring-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img 
                          src={img.image_url} 
                          alt={img.alt_text || product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center h-96 lg:h-[500px]">
                <Package className="text-muted-foreground" size={64} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              {category && (
                <Badge variant="secondary" className="mb-4">
                  {category.name}
                </Badge>
              )}
              <p className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                {product.price} {product.price_currency}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-foreground mb-2">وصف المنتج</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Additional Details */}
            {product.additional_details && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-foreground mb-2">تفاصيل إضافية</h3>
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.additional_details.replace(/\n/g, '<br>') }}
                />
              </div>
            )}

            {/* WhatsApp Button */}
            <div className="pt-4">
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                size="lg"
              >
                <MessageCircle className="ml-2" size={20} />
                الاستفسار عبر الواتساب
              </Button>
            </div>

            {/* Product Features */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">مميزات المنتج</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    جودة عالية ومواد خام ممتازة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    ضمان الجودة والمتانة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    تصميم أنيق وعصري
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    مناسب لجميع الأذواق
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}