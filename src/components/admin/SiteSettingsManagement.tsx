import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, Palette, Phone, MessageSquare, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsForm {
  site_name: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  contact_address: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
}

export function SiteSettingsManagement() {
  const { settings, settingsMap, loading } = useSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SettingsForm>({
    site_name: '',
    site_description: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_email: '',
    contact_address: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    primary_color: '',
    secondary_color: '',
    logo_url: ''
  });

  // تحديث النموذج عند تحميل الإعدادات
  useEffect(() => {
    if (settingsMap && Object.keys(settingsMap).length > 0) {
      setFormData({
        site_name: settingsMap.site_name || '',
        site_description: settingsMap.site_description || '',
        hero_title: settingsMap.hero_title || '',
        hero_subtitle: settingsMap.hero_subtitle || '',
        hero_image_url: settingsMap.hero_image_url || '',
        contact_phone: settingsMap.contact_phone || '',
        contact_whatsapp: settingsMap.contact_whatsapp || '',
        contact_email: settingsMap.contact_email || '',
        contact_address: settingsMap.contact_address || '',
        facebook_url: settingsMap.facebook_url || '',
        instagram_url: settingsMap.instagram_url || '',
        twitter_url: settingsMap.twitter_url || '',
        primary_color: settingsMap.primary_color || '',
        secondary_color: settingsMap.secondary_color || '',
        logo_url: settingsMap.logo_url || ''
      });
    }
  }, [settingsMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // تحديث أو إدراج كل إعداد
      const updates = Object.entries(formData).map(async ([key, value]) => {
        const existingSetting = settings.find(s => s.key === key);
        
        if (existingSetting) {
          return supabase
            .from('settings')
            .update({ value })
            .eq('id', existingSetting.id);
        } else {
          return supabase
            .from('settings')
            .insert([{
              key,
              value,
              description: getSettingDescription(key)
            }]);
        }
      });

      const results = await Promise.all(updates);
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        throw new Error('فشل في حفظ بعض الإعدادات');
      }
      
      toast({ title: "تم حفظ الإعدادات بنجاح" });
      // لا حاجة لإعادة تحميل الصفحة، البيانات ستتحديث تلقائياً
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: error instanceof Error ? error.message : "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      site_name: 'اسم الموقع',
      site_description: 'وصف الموقع',
      hero_title: 'عنوان البانر الرئيسي',
      hero_subtitle: 'النص الفرعي للبانر',
      hero_image_url: 'رابط صورة البانر',
      contact_phone: 'رقم التواصل',
      contact_whatsapp: 'رقم الواتساب',
      contact_email: 'البريد الإلكتروني',
      contact_address: 'العنوان',
      facebook_url: 'رابط فيسبوك',
      instagram_url: 'رابط إنستجرام',
      twitter_url: 'رابط تويتر',
      primary_color: 'اللون الأساسي',
      secondary_color: 'اللون الثانوي',
      logo_url: 'رابط الشعار'
    };
    return descriptions[key] || key;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
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
          <h2 className="text-2xl font-bold">إعدادات الموقع</h2>
          <p className="text-muted-foreground">تحكم في جميع إعدادات الموقع والمحتوى</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* إعدادات الموقع العامة */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" />
              إعدادات الموقع العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name">اسم الموقع</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="logo_url">رابط الشعار</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="site_description">وصف الموقع</Label>
              <Textarea
                id="site_description"
                value={formData.site_description}
                onChange={(e) => setFormData({...formData, site_description: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* إعدادات البانر الرئيسي */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-primary" />
              إعدادات البانر الرئيسي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">العنوان الرئيسي</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="hero_subtitle">النص الفرعي</Label>
              <Textarea
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="hero_image_url">رابط صورة البانر</Label>
              <Input
                id="hero_image_url"
                value={formData.hero_image_url}
                onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* بيانات التواصل */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              بيانات التواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">رقم التواصل</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_whatsapp">رقم الواتساب</Label>
                <Input
                  id="contact_whatsapp"
                  value={formData.contact_whatsapp}
                  onChange={(e) => setFormData({...formData, contact_whatsapp: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_email">البريد الإلكتروني</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_address">العنوان</Label>
                <Input
                  id="contact_address"
                  value={formData.contact_address}
                  onChange={(e) => setFormData({...formData, contact_address: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* وسائل التواصل الاجتماعي */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              وسائل التواصل الاجتماعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebook_url">رابط فيسبوك</Label>
                <Input
                  id="facebook_url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="instagram_url">رابط إنستجرام</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="twitter_url">رابط تويتر</Label>
                <Input
                  id="twitter_url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الألوان */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              إعدادات الألوان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">اللون الأساسي</Label>
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="secondary_color">اللون الثانوي</Label>
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Save className="h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}