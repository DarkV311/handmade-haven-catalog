import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Settings, Package, FileText } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_currency: string;
  image_url: string;
  category_id: string;
  is_active: boolean;
  sort_order: number;
}

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export default function Admin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes, settingsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').order('sort_order'),
        supabase.from('settings').select('*')
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = async (data: any) => {
    try {
      if (editingItem) {
        await supabase.from('categories').update(data).eq('id', editingItem.id);
        toast({ title: "تم التحديث", description: "تم تحديث القسم بنجاح" });
      } else {
        await supabase.from('categories').insert(data);
        toast({ title: "تم الإضافة", description: "تم إضافة القسم بنجاح" });
      }
      loadData();
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingItem) {
        await supabase.from('products').update(data).eq('id', editingItem.id);
        toast({ title: "تم التحديث", description: "تم تحديث المنتج بنجاح" });
      } else {
        await supabase.from('products').insert(data);
        toast({ title: "تم الإضافة", description: "تم إضافة المنتج بنجاح" });
      }
      loadData();
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  const handleSaveSetting = async (key: string, value: string) => {
    try {
      await supabase.from('settings').update({ value }).eq('key', key);
      toast({ title: "تم التحديث", description: "تم تحديث الإعداد بنجاح" });
      loadData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الإعداد",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (table: 'categories' | 'products' | 'settings', id: string) => {
    try {
      await supabase.from(table).delete().eq('id', id);
      toast({ title: "تم الحذف", description: "تم حذف العنصر بنجاح" });
      loadData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف العنصر",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            لوحة إدارة الموقع
          </h1>
          <p className="text-muted-foreground">إدارة المنتجات والأقسام وإعدادات الموقع</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { key: 'products', label: 'المنتجات', icon: Package },
            { key: 'categories', label: 'الأقسام', icon: FileText },
            { key: 'settings', label: 'الإعدادات', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'outline'}
              onClick={() => setActiveTab(key as any)}
              className="flex items-center gap-2"
            >
              <Icon size={18} />
              {label}
            </Button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>إدارة المنتجات</CardTitle>
                  <CardDescription>إضافة وتعديل وحذف المنتجات</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingItem(null)} className="flex items-center gap-2">
                      <Plus size={18} />
                      إضافة منتج جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
                      <DialogDescription>أدخل بيانات المنتج</DialogDescription>
                    </DialogHeader>
                    <ProductForm
                      product={editingItem}
                      categories={categories}
                      onSave={handleSaveProduct}
                      onCancel={() => { setIsDialogOpen(false); setEditingItem(null); }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.price} {product.price_currency}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingItem(product); setIsDialogOpen(true); }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('products', product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>إدارة الأقسام</CardTitle>
                  <CardDescription>إضافة وتعديل وحذف أقسام المنتجات</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingItem(null)} className="flex items-center gap-2">
                      <Plus size={18} />
                      إضافة قسم جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'تعديل القسم' : 'إضافة قسم جديد'}</DialogTitle>
                      <DialogDescription>أدخل بيانات القسم</DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                      category={editingItem}
                      onSave={handleSaveCategory}
                      onCancel={() => { setIsDialogOpen(false); setEditingItem(null); }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">الرمز: {category.icon}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingItem(category); setIsDialogOpen(true); }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('categories', category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الموقع</CardTitle>
              <CardDescription>تعديل إعدادات الموقع العامة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {settings.map((setting) => (
                  <SettingField
                    key={setting.id}
                    setting={setting}
                    onSave={handleSaveSetting}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ product, categories, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    price_currency: product?.price_currency || 'ج.م',
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, price: parseFloat(formData.price) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم المنتج</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">السعر</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">العملة</Label>
          <Input
            id="currency"
            value={formData.price_currency}
            onChange={(e) => setFormData({ ...formData, price_currency: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">رابط الصورة</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="category">القسم</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">حفظ</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">إلغاء</Button>
      </div>
    </form>
  );
}

// Category Form Component
function CategoryForm({ category, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || '',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم القسم</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">المعرف (بالإنجليزية)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="icon">اسم الأيقونة</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="مثال: Package, Flame, Clock"
          required
        />
      </div>

      <div>
        <Label htmlFor="sort_order">ترتيب الظهور</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">حفظ</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">إلغاء</Button>
      </div>
    </form>
  );
}

// Setting Field Component
function SettingField({ setting, onSave }: any) {
  const [value, setValue] = useState(setting.value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(setting.key, value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <Label className="font-semibold">{setting.description}</Label>
        {isEditing ? (
          <div className="mt-2">
            {setting.key.includes('subtitle') || setting.key.includes('description') ? (
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">{value}</p>
        )}
      </div>
      <div className="flex gap-2 mr-4">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave}>حفظ</Button>
            <Button size="sm" variant="outline" onClick={() => { setIsEditing(false); setValue(setting.value); }}>إلغاء</Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            <Edit size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}