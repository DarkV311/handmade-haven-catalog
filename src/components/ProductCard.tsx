import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onWhatsApp: (product: Product) => void;
}

export function ProductCard({ product, onWhatsApp }: ProductCardProps) {
  const handleWhatsApp = async () => {
    // Track product inquiry
    try {
      const { error } = await supabase
        .from('product_inquiries')
        .insert([{
          product_id: product.id,
          visitor_ip: null // Browser can't get IP directly
        }]);
      
      if (error) console.error('Error tracking inquiry:', error);
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }

    const message = `السلام عليكم، أريد الاستفسار عن هذا المنتج:\n\n${product.name}\n${product.description}\nالسعر: ${product.price}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201004119595?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    if (onWhatsApp) {
      onWhatsApp(product);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-warm hover:-translate-y-1 bg-card border border-border">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            {product.price}
          </span>
          
          <Button 
            onClick={() => window.location.href = `/product/${product.id}`}
            variant="outline"
            className="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            عرض التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}