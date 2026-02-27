import { ReactNode } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[50%] xl:w-[45%] lg:px-20 xl:px-28 z-10 relative">
        <div className="relative w-full">
          {children}
        </div>
      </div>

      {/* Right side - Image Cover (desktop only) */}
      <div className="hidden lg:block relative flex-1 w-full bg-muted">
        {/* Abstract shapes overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
          alt="Tech aesthetic workspace"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        
        {/* Testimonial / Decorative content */}
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <div className="flex flex-col gap-6 max-w-xl">
            <Quote className="h-10 w-10 text-cyan-400 opacity-80" />
            <blockquote className="space-y-2">
              <p className="text-2xl font-medium leading-snug">
                &quot;Thật tuyệt vời khi có thể trải nghiệm mua sắm các sản phẩm công nghệ với giá cả hợp lý và giao diện siêu thân thiện. Đây là nơi tôi luôn tin tưởng.&quot;
              </p>
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-white/10 overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                  alt="Avatar"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-lg">Nguyễn Thị An</div>
                <div className="text-cyan-300 text-sm">Khách hàng thân thiết</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
