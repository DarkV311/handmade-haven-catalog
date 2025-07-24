import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SiteSettingsManagement } from "@/components/admin/SiteSettingsManagement";
import { HeroImageManagement } from "@/components/admin/HeroImageManagement";
import { ProductInquiriesManagement } from "@/components/admin/ProductInquiriesManagement";
import { BarChart3, Package, FolderOpen, Settings, MessageSquare, LogOut, Image, TrendingUp } from "lucide-react";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useToast } from "@/hooks/use-toast";

function AdminContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_session");
    toast({ title: "تم تسجيل الخروج بنجاح" });
    navigate("/admin/login");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-muted-foreground">إدارة شاملة للموقع والمنتجات</p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="h-4 w-4" />
            لوحة التحكم
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Package className="h-4 w-4" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FolderOpen className="h-4 w-4" />
            الأقسام
          </TabsTrigger>
          <TabsTrigger value="hero-images" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Image className="h-4 w-4" />
            صور الواجهة
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4" />
            الاستفسارات
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="h-4 w-4" />
            الرسائل
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="hero-images">
          <HeroImageManagement />
        </TabsContent>

        <TabsContent value="inquiries">
          <ProductInquiriesManagement />
        </TabsContent>

        <TabsContent value="messages">
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">إدارة الرسائل</h3>
            <p className="text-muted-foreground">سيتم إضافة هذه الميزة قريباً</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SiteSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedAdminRoute>
      <AdminContent />
    </ProtectedAdminRoute>
  );
}