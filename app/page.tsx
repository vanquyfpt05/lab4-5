import { ProductList } from "@/components/ProductList";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 space-y-4 text-center fade-in slide-in-from-bottom-4 duration-500 animate-in">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Featured Products
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Upgrade your setup with our premium selection of tech essentials.
          </p>
      </section>
      <ProductList />
    </div>
  );
}
