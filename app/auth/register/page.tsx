"use client";

import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-muted-foreground animate-pulse text-center">Đang tải biểu mẫu...</div>}>
        <AuthForm type="register" />
      </Suspense>
    </AuthLayout>
  );
}
