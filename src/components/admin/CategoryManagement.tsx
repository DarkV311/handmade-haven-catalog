import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, FolderOpen, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryForm {
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export function CategoryManagement() {
  const { categories, loading } = useCategories();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    slug: '',
    icon: '',
    is_active: true,
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      icon: '',
      is_active: true,
      sort_order: 0
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        toast({ title: "تم تحديث القسم بنجاح" });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "تم إضافة القسم بنجاح" });
      }
      
      resetForm();
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: error instanceof Error ? error.message : "فشل في حفظ القسم",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      toast({ title: "تم حذف القسم بنجاح" });
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: "فشل في حذف القسم",
        variant: "destructive"
      });
    }
  };

  const updateSortOrder = async (categoryId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ sort_order: newOrder })
        .eq('id', categoryId);
      
      if (error) throw error;
      toast({ title: "تم تحديث الترتيب بنجاح" });
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: "فشل في تحديث الترتيب",
        variant: "destructive"
      });
    }
  };

  const moveUp = (category: any) => {
    const newOrder = category.sort_order - 1;
    if (newOrder >= 0) {
      updateSortOrder(category.id, newOrder);
    }
  };

  const moveDown = (category: any) => {
    const newOrder = category.sort_order + 1;
    updateSortOrder(category.id, newOrder);
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
          <h2 className="text-2xl font-bold">إدارة الأقسام</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف أقسام المنتجات</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          إضافة قسم جديد
        </Button>
      </div>

      {showForm && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
              {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم القسم</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">الرابط المختصر</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">أيقونة القسم</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="مثال: Package"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sort_order">ترتيب العرض</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">قسم نشط</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* قائمة الأقسام */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  {category.icon && <span className="text-primary">{category.icon}</span>}
                  {category.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveUp(category)}
                    disabled={category.sort_order === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveDown(category)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">الرابط: {category.slug}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ترتيب: {category.sort_order}</span>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "نشط" : "غير نشط"}
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