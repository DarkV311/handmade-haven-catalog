import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MessageCircle } from "lucide-react";

interface ProductInquiry {
  product_id: string;
  product_name: string;
  product_image_url: string;
  inquiry_count: number;
  last_inquiry: string;
}

export function ProductInquiriesManagement() {
  const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductInquiries();
  }, []);

  const fetchProductInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('product_inquiries')
        .select(`
          product_id,
          products!inner(name, image_url),
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by product and count inquiries
      const grouped = data.reduce((acc: any, inquiry: any) => {
        const productId = inquiry.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            product_id: productId,
            product_name: inquiry.products.name,
            product_image_url: inquiry.products.image_url,
            inquiry_count: 0,
            last_inquiry: inquiry.created_at
          };
        }
        acc[productId].inquiry_count++;
        if (new Date(inquiry.created_at) > new Date(acc[productId].last_inquiry)) {
          acc[productId].last_inquiry = inquiry.created_at;
        }
        return acc;
      }, {});

      const sortedInquiries = Object.values(grouped) as ProductInquiry[];
      sortedInquiries.sort((a, b) => b.inquiry_count - a.inquiry_count);

      setInquiries(sortedInquiries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الاستفسارات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">المنتجات الأكثر استفساراً</h2>
          <p className="text-muted-foreground">تتبع المنتجات التي يهتم بها العملاء أكثر</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد استفسارات حتى الآن</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inquiries.map((inquiry, index) => (
            <Card key={inquiry.product_id} className="relative overflow-hidden">
              {index < 3 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                    #{index + 1}
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  {inquiry.product_name}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {inquiry.product_image_url && (
                  <img
                    src={inquiry.product_image_url}
                    alt={inquiry.product_name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">عدد الاستفسارات:</span>
                    <Badge variant="outline" className="font-bold">
                      {inquiry.inquiry_count}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">آخر استفسار:</span>
                    <span className="text-sm">
                      {new Date(inquiry.last_inquiry).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}