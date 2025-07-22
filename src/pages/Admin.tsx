import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { SiteSettingsManagement } from "@/components/admin/SiteSettingsManagement";
import { BarChart3, Package, FolderOpen, ShoppingCart, Settings, MessageSquare } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم الإدارية</h1>
        <p className="text-muted-foreground">إدارة شاملة للموقع والمنتجات والطلبات</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            لوحة التحكم
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            الأقسام
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            الطلبات
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            الرسائل
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
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

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="messages">
          <div className="text-center py-8 text-muted-foreground">
            سيتم إضافة إدارة الرسائل قريباً
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SiteSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}