/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { ShoppingCart, LogIn, UserPlus, LogOut, Package, Bot } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
  const { totalItems } = useCart();
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/98 shadow-sm backdrop-blur-md"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md transition-transform group-hover:scale-105">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <span className="hidden font-extrabold tracking-tight sm:inline-block text-foreground">
            Next<span className="text-cyan-600">Store</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Trang Chủ
          </Link>
          <Link href="/#products" className="hover:text-foreground transition-colors">
            Sản Phẩm
          </Link>
          <Link href="/chat" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-cyan-600" />
            Hỗ Trợ AI
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Auth Buttons */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                 <Link href="/orders" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                    <Package className="h-4 w-4" />
                    Đơn Hàng
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                    <LogIn className="h-4 w-4" />
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/auth/register" className="hidden sm:block">
                  <Button
                    size="sm"
                    className="gap-1.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:from-cyan-400 hover:to-blue-500 shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Đăng Ký
                  </Button>
                </Link>
              </div>
            )
          )}

          {/* Cart Icon */}
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 ml-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-50 duration-300">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
