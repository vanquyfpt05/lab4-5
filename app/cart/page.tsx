"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, isClient } = useCart();

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isClient) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="mb-4 text-muted-foreground">Your cart is empty</div>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center py-4 border-b last:border-0"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border text-muted-foreground">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium leading-none">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-right font-medium sm:w-24">
                      {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>{cartTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{cartTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">Checkout</Button>
              </CardFooter>
            </Card>
            <div className="mt-4 flex justify-center">
                <Link href="/" className="text-sm text-muted-foreground hover:underline flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
