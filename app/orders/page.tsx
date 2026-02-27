"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, PackageOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/ui/button";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login?redirect=/orders");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || (loadingOrders && user)) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center flex-col text-muted-foreground min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <PackageOpen className="w-8 h-8 text-primary" />
          Lịch Sử Đơn Hàng
        </h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi trạng thái và lịch sử mua sắm của bạn.
        </p>
        {searchParams.get("success") === "true" && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900 font-medium">
            🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}
      </div>

      {orders.length === 0 && !error ? (
        <div className="text-center py-16 px-4 bg-muted/30 rounded-2xl border border-dashed text-muted-foreground">
          <PackageOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
          <p className="mb-6 max-w-sm mx-auto">
            Bạn vẫn chưa thực hiện đơn mua hàng nào. Hãy khám phá sản phẩm và mua sắm ngay!
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 text-white">
              Về Trang Chủ Mua Sắm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          <div className="mt-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Về trang mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-24 flex justify-center items-center flex-col text-muted-foreground min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p>Đang tải dữ liệu...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
