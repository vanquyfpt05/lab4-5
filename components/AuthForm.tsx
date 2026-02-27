/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2, AlertCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Chuyển đổi tên tài khoản thành định dạng email giả lập để phù hợp với hệ thống Supabase
    // Nếu người dùng nhập email thật, giữ nguyên. Nếu chỉ nhập tên (vd: "vanquy"), tự thêm đuôi.
    const emailToUse = username.includes("@") ? username : `${username.toLowerCase().replace(/\s+/g, "")}@nextstore.com`;

    try {
      if (type === "register") {
        const { error } = await supabase.auth.signUp({
          email: emailToUse,
          password,
        });
        if (error) {
          console.error("Supabase SignUp Error:", error);
          throw error;
        }
        // Bỏ qua bước xác nhận email đi vì chúng ta dùng tài khoản ảo
        router.push("/auth/login?message=Đăng ký thành công! Vui lòng đăng nhập.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password,
        });
        if (error) {
          console.error("Supabase SignIn Error:", error);
          throw error;
        }
        router.push(redirect);
      }
    } catch (err) {
      console.error("Auth Catch Error:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = type === "login";

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center justify-center space-x-2 group mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg transition-transform group-hover:scale-105">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-2xl text-foreground">
            Next<span className="text-cyan-600">Store</span>
          </span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? "Nhập tài khoản và mật khẩu của bạn"
            : "Đăng ký tài khoản để mua sắm ngay"}
        </p>
      </div>

      {searchParams.get("message") && (
        <div className="p-4 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-sm rounded-xl border border-green-200 dark:border-green-900 font-medium text-center shadow-sm">
          {searchParams.get("message")}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-sm rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-900 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span className="font-medium">{error === "Email not confirmed" ? "Tính năng xác nhận Email (Confirm Email) vẫn đang BẬT trên Supabase. Bạn cần tắt nó đi trong phần Authentication -> Providers -> Email." : error === "Invalid login credentials" ? "Tài khoản hoặc mật khẩu không chính xác" : error === "User already registered" ? "Tài khoản này đã tồn tại" : error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/90" htmlFor="username">
              Tài Khoản
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-cyan-600" />
              <input
                id="username"
                type="text"
                required
                className="flex h-12 w-full rounded-xl border border-input/60 bg-background/50 px-3 py-2 pl-11 text-sm transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ví dụ: vanquy0604"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="password">
                Mật khẩu
              </label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-cyan-600" />
              <input
                id="password"
                type="password"
                required
                className="flex h-12 w-full rounded-xl border border-input/60 bg-background/50 px-3 py-2 pl-11 text-sm transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : null}
          {isLogin ? "Đăng Nhập" : "Đăng Ký"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground pt-2">
        {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
        <Link
          href={isLogin ? `/auth/register?redirect=${encodeURIComponent(redirect)}` : `/auth/login?redirect=${encodeURIComponent(redirect)}`}
          className="font-semibold text-cyan-600 hover:text-cyan-500 hover:underline transition-colors block mt-2 sm:inline sm:mt-0"
        >
          {isLogin ? "Đăng ký ngay miến phí" : "Đăng nhập tại đây"}
        </Link>
      </div>
    </div>
  );
}
