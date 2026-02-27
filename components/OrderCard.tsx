import { format } from "date-fns";
import { Package, Calendar, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/hooks/use-cart";
import Image from "next/image";

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  items: CartItem[];
}

interface OrderCardProps {
  order: Order;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Đang xử lý", variant: "secondary" },
  completed: { label: "Hoàn thành", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo = statusMap[order.status] || { label: order.status, variant: "outline" };

  return (
    <Card className="shadow-sm overflow-hidden mb-6">
      <CardHeader className="bg-muted/50 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Đơn hàng: <span className="font-normal text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(order.created_at), "dd/MM/yyyy HH:mm:ss")}
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="w-fit">
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium">
                  {(item.price * item.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 flex flex-col sm:flex-row sm:justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4" />
          <span>Thanh toán:</span>
        </div>
        <div className="text-lg font-bold text-primary">
          {order.total_price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
