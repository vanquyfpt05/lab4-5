"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Tag, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalItems, isClient, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;

  if (!isClient) {
    return null;
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/cart");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          total_price: finalTotal,
          items: cart,
          status: "pending",
        },
      ]).select();

      if (insertError) throw insertError;

      clearCart();
      router.push("/orders?success=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo đơn hàng.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Giỏ Hàng</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalItems > 0
              ? `Bạn có ${totalItems} sản phẩm trong giỏ hàng`
              : "Giỏ hàng của bạn đang trống"}
          </p>
        </div>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={clearCart}
            disabled={isSubmitting}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Xóa Tất Cả
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-sm flex items-start gap-2 border border-red-200 dark:border-red-900">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-16 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Chưa có sản phẩm nào</h2>
          <p className="mb-6 text-muted-foreground">
            Hãy khám phá cửa hàng và thêm sản phẩm yêu thích vào giỏ hàng!
          </p>
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:from-cyan-400 hover:to-blue-500">
              <ShoppingBag className="h-4 w-4" />
              Tiếp Tục Mua Sắm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">
                  Sản Phẩm ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y p-0">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Name & Price */}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold leading-tight">{item.name}</h3>
                      <p className="text-sm font-medium text-primary">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border bg-background overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isSubmitting}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isSubmitting}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Xóa sản phẩm"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Subtotal */}
                    <div className="min-w-[100px] text-right font-bold">
                      {(item.price * item.quantity).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="shadow-sm sticky top-20">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>
                    {cartTotal.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingFee === 0
                      ? "Miễn phí"
                      : shippingFee.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                    <Tag className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    Mua thêm{" "}
                    {(500000 - cartTotal).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                    để được miễn phí vận chuyển!
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {finalTotal.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:from-cyan-400 hover:to-blue-500 shadow-md"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={authLoading || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {user ? "Mua Hàng" : "Đăng Nhập để Mua Hàng"}
                </Button>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
