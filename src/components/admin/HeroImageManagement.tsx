import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useHeroImages } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Image, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroImageForm {
  title: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export function HeroImageManagement() {
  const { heroImages, loading, refetch } = useHeroImages();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<HeroImageForm>({
    title: '',
    image_url: '',
    is_active: true,
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      is_active: true,
      sort_order: 0
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('hero-images').getPublicUrl(fileName);
      
      setFormData({...formData, image_url: data.publicUrl});
      toast({ title: "تم رفع الصورة بنجاح" });
    } catch (error) {
      toast({ 
        title: "خطأ في رفع الصورة", 
        description: error instanceof Error ? error.message : "فشل في رفع الصورة",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (heroImages.length >= 5 && !editingImage) {
      toast({ 
        title: "لا يمكن إضافة المزيد", 
        description: "الحد الأقصى 5 صور فقط",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingImage) {
        const { error } = await supabase
          .from('hero_images')
          .update(formData)
          .eq('id', editingImage.id);
        
        if (error) throw error;
        toast({ title: "تم تحديث الصورة بنجاح" });
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "تم إضافة الصورة بنجاح" });
      }
      
      resetForm();
      refetch();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: error instanceof Error ? error.message : "فشل في حفظ الصورة",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      image_url: image.image_url,
      is_active: image.is_active,
      sort_order: image.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    
    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      toast({ title: "تم حذف الصورة بنجاح" });
      refetch();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: "فشل في حذف الصورة",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة صور الواجهة الرئيسية</h2>
          <p className="text-muted-foreground">تحكم في الصور التي تظهر في الصفحة الرئيسية (حد أقصى 5 صور)</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="gap-2 shadow-sm"
          disabled={heroImages.length >= 5}
        >
          <Plus className="h-4 w-4" />
          إضافة صورة ({heroImages.length}/5)
        </Button>
      </div>

      {showForm && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="h-5 w-5 text-primary" />
              {editingImage ? 'تعديل صورة' : 'إضافة صورة جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الصورة</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>الصورة</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <Button type="button" disabled={uploading} variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                    </Button>
                  </div>
                  <Input
                    placeholder="أو أدخل رابط الصورة"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
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
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">صورة نشطة</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {editingImage ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* قائمة الصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroImages.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{image.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {image.image_url && (
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <div className="flex justify-between items-center">
                <Badge variant={image.is_active ? "default" : "secondary"}>
                  {image.is_active ? "نشط" : "غير نشط"}
                </Badge>
                <Badge variant="outline">
                  ترتيب: {image.sort_order}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}