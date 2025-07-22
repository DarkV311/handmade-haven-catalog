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
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الأقسام</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الزيارات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitorsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث المنتجات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
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

        {/* أحدث الرسائل */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              أحدث الرسائل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="space-y-1">
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
                <p className="text-muted-foreground text-center py-4">لا توجد رسائل</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* أحدث الطلبات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              أحدث الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.total_amount} جنيه</p>
                  </div>
                  <Badge variant={
                    order.status === 'pending' ? 'default' :
                    order.status === 'in_progress' ? 'secondary' :
                    order.status === 'shipped' ? 'outline' :
                    order.status === 'delivered' ? 'default' : 'destructive'
                  }>
                    {order.status === 'pending' ? 'في الانتظار' :
                     order.status === 'in_progress' ? 'قيد التنفيذ' :
                     order.status === 'shipped' ? 'تم الشحن' :
                     order.status === 'delivered' ? 'تم التسليم' : 'ملغي'}
                  </Badge>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-4">لا توجد طلبات</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* المنتجات الأكثر مشاهدة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              المنتجات الأكثر مشاهدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularProducts.slice(0, 5).map((item, index) => (
                <div key={item.product_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">#{index + 1}</span>
                    <span>منتج {item.product_id}</span>
                  </div>
                  <Badge variant="outline">
                    {item.count} مشاهدة
                  </Badge>
                </div>
              ))}
              {stats.popularProducts.length === 0 && (
                <p className="text-muted-foreground text-center py-4">لا توجد بيانات مشاهدة</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}