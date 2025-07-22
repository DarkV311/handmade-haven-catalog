import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import { useColors, useSizes } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Package, Palette, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  is_active: boolean;
  has_variants: boolean;
  base_quantity: number;
}

export function ProductManagement() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { colors, loading: colorsLoading } = useColors();
  const { sizes, loading: sizesLoading } = useSizes();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_url: '',
    is_active: true,
    has_variants: false,
    base_quantity: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      image_url: '',
      is_active: true,
      has_variants: false,
      base_quantity: 0
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast({ title: "تم تحديث المنتج بنجاح" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "تم إضافة المنتج بنجاح" });
      }
      
      resetForm();
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: error instanceof Error ? error.message : "فشل في حفظ المنتج",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_active: product.is_active,
      has_variants: product.has_variants || false,
      base_quantity: product.base_quantity || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      toast({ title: "تم حذف المنتج بنجاح" });
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: "فشل في حذف المنتج",
        variant: "destructive"
      });
    }
  };

  if (productsLoading || categoriesLoading) {
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
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {showForm && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم المنتج</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">القسم</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="base_quantity">الكمية الأساسية</Label>
                  <Input
                    id="base_quantity"
                    type="number"
                    value={formData.base_quantity}
                    onChange={(e) => setFormData({...formData, base_quantity: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">منتج نشط</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_variants"
                  checked={formData.has_variants}
                  onCheckedChange={(checked) => setFormData({...formData, has_variants: checked})}
                />
                <Label htmlFor="has_variants">يحتوي على متغيرات (ألوان/مقاسات)</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* قائمة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{product.price} {product.price_currency}</span>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {product.has_variants && (
                    <Badge variant="outline" className="gap-1">
                      <Palette className="h-3 w-3" />
                      متغيرات
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <Package className="h-3 w-3" />
                    {product.base_quantity || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}