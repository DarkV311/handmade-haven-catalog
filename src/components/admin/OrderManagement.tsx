import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Phone, Mail, MapPin, Calendar, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusOptions = [
  { value: 'pending', label: 'في الانتظار', variant: 'default' as const },
  { value: 'in_progress', label: 'قيد التنفيذ', variant: 'secondary' as const },
  { value: 'shipped', label: 'تم الشحن', variant: 'outline' as const },
  { value: 'delivered', label: 'تم التسليم', variant: 'default' as const },
  { value: 'cancelled', label: 'ملغي', variant: 'destructive' as const }
];

export function OrderManagement() {
  const { orders, loading } = useOrders();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      toast({ title: "تم تحديث حالة الطلب بنجاح" });
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "حدث خطأ", 
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <div className="text-sm text-muted-foreground">
          إجمالي الطلبات: {orders.length}
        </div>
      </div>

      {/* فلاتر البحث */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل الطلب</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">العميل:</span>
                              <span>{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{order.customer_phone}</span>
                            </div>
                            {order.customer_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{order.customer_email}</span>
                              </div>
                            )}
                            {order.customer_address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{order.customer_address}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">المبلغ الإجمالي:</span>
                              <span className="font-bold text-lg">{order.total_amount} جنيه</span>
                            </div>
                          </div>
                          {order.notes && (
                            <div>
                              <span className="font-medium">ملاحظات:</span>
                              <p className="mt-1 text-muted-foreground">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer_phone}</span>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">{order.total_amount} جنيه</span>
                  {order.notes && (
                    <span className="text-sm text-muted-foreground truncate max-w-xs">
                      {order.notes}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد طلبات تطابق معايير البحث
          </div>
        )}
      </div>
    </div>
  );
}