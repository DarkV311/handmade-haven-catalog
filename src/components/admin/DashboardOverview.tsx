import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats } from "@/hooks/useAdminData";
import { Package, FolderOpen, ShoppingCart, Users, TrendingUp, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverview() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        خطأ في تحميل الإحصائيات: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">نظرة عامة</h2>
          <p className="text-muted-foreground">إحصائيات ومقاييس الأداء</p>
        </div>
      </div>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد المنتجات</CardTitle>
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.productsCount}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">منتج نشط</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الأقسام</CardTitle>
            <FolderOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.categoriesCount}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">قسم فعال</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الزيارات</CardTitle>
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.visitorsCount}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">زائر هذا الشهر</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث المنتجات */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              أحدث المنتجات المضافة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.price} {product.price_currency}</p>
                  </div>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
              ))}
              {stats.recentProducts.length === 0 && (
                <p className="text-muted-foreground text-center py-4">لا توجد منتجات</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* المنتجات الأكثر مشاهدة */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              المنتجات الأكثر مشاهدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularProducts.slice(0, 5).map((item, index) => (
                <div key={item.product_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      #{index + 1}
                    </span>
                    <span className="font-medium">منتج {item.product_id}</span>
                  </div>
                  <Badge variant="outline" className="bg-background">
                    {item.count} مشاهدة
                  </Badge>
                </div>
              ))}
              {stats.popularProducts.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">لا توجد بيانات مشاهدة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* أحدث الرسائل */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              أحدث الرسائل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{message.name}</p>
                    <Badge variant={message.is_read ? "secondary" : "default"}>
                      {message.is_read ? "مقروءة" : "جديدة"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.message}
                  </p>
                </div>
              ))}
              {stats.recentMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">لا توجد رسائل</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}