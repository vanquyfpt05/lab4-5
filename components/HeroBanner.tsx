"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Truck, label: "Miễn phí vận chuyển", desc: "Đơn hàng từ 500K" },
  { icon: Shield, label: "Bảo hành chính hãng", desc: "12 tháng bảo hành" },
  { icon: Zap, label: "Giao hàng nhanh", desc: "Nhận hàng trong 24h" },
];

export function HeroBanner() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              Bộ sưu tập mới nhất 2025
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Công Nghệ{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Đỉnh Cao
              </span>
              <br />
              Dành Cho Bạn
            </h1>

            <p className="mb-8 mx-auto max-w-lg text-lg text-slate-300">
              Khám phá hàng ngàn sản phẩm công nghệ cao cấp với giá tốt nhất.
              Mua sắm dễ dàng, không cần đăng nhập!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#products">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-blue-900/50 border-0"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Mua Sắm Ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40"
                >
                  Đăng Nhập / Đăng Ký
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60L48 51.7C96 43.3 192 26.7 288 25.3C384 24 480 38 576 44.3C672 50.7 768 49.3 864 42.7C960 36 1056 24 1152 21.3C1248 18.7 1344 25.3 1392 28.7L1440 32V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Feature Strips */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
