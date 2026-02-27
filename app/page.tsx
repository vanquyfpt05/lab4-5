import { ProductList } from "@/components/ProductList";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryFilter } from "@/components/CategoryFilter";

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <section className="mb-8 space-y-2 text-center fade-in slide-in-from-bottom-4 duration-500 animate-in">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Bộ Sưu Tập
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-base">
            Khám phá các sản phẩm công nghệ cao cấp được tuyển chọn kỹ lưỡng
          </p>
        </section>

        <CategoryFilter />
      </div>
    </div>
  );
}
