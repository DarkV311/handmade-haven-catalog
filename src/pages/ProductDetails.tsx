import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Package, Palette, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const product = products.find(p => p.id === id);
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
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            
            {/* Additional Images Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="aspect-square rounded border border-border bg-muted flex items-center justify-center"
                >
                  <Package className="text-muted-foreground" size={24} />
                </div>
              ))}
            </div>
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

            {/* Colors */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={20} className="text-primary" />
                  <h3 className="font-semibold text-foreground">الألوان المتاحة</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <div className="w-4 h-4 rounded-full border border-border bg-red-500" />
                    <span className="text-sm text-foreground">أحمر</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <div className="w-4 h-4 rounded-full border border-border bg-blue-500" />
                    <span className="text-sm text-foreground">أزرق</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <div className="w-4 h-4 rounded-full border border-border bg-green-500" />
                    <span className="text-sm text-foreground">أخضر</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler size={20} className="text-primary" />
                  <h3 className="font-semibold text-foreground">المقاسات المتاحة</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 text-center rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <span className="font-medium text-foreground">S</span>
                  </div>
                  <div className="p-3 text-center rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <span className="font-medium text-foreground">M</span>
                  </div>
                  <div className="p-3 text-center rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <span className="font-medium text-foreground">L</span>
                  </div>
                  <div className="p-3 text-center rounded border border-border hover:bg-accent cursor-pointer transition-colors">
                    <span className="font-medium text-foreground">XL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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