"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Heart, CheckCircle, Zap, Loader2 } from "lucide-react";
import { Product, useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// Extended interface for display purposes
interface ProductDisplay extends Product {
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
}

const products: ProductDisplay[] = [
  {
    id: 1,
    name: "Tai Nghe Không Dây",
    price: 4990000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Âm Thanh",
    rating: 4.8,
    reviews: 124,
    isNew: true,
  },
  {
    id: 2,
    name: "Bàn Phím Cơ",
    price: 3490000,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80",
    category: "Phụ Kiện",
    rating: 4.9,
    reviews: 85,
    isSale: true,
  },
  {
    id: 3,
    name: "Chuột Gaming",
    price: 1890000,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80",
    category: "Gaming",
    rating: 4.7,
    reviews: 200,
  },
  {
    id: 4,
    name: "Màn Hình 4K",
    price: 9990000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    category: "Màn Hình",
    rating: 4.6,
    reviews: 56,
  },
  {
    id: 5,
    name: "Đồng Hồ Thông Minh",
    price: 5990000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Wearables",
    rating: 4.7,
    reviews: 89,
    isNew: true,
  },
  {
    id: 6,
    name: "Webcam HD 1080p",
    price: 1290000,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80",
    category: "Phụ Kiện",
    rating: 4.5,
    reviews: 42,
  },
  {
    id: 7,
    name: "Đế Tản Nhiệt Laptop",
    price: 590000,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80",
    category: "Phụ Kiện",
    rating: 4.6,
    reviews: 156,
    isSale: true,
  },
  {
    id: 8,
    name: "Micro Thu Âm USB",
    price: 2490000,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80",
    category: "Âm Thanh",
    rating: 4.8,
    reviews: 73,
  },
];

interface ProductListProps {
  activeCategory?: string;
  sortBy?: string;
}

export function ProductList({ activeCategory = "Tất Cả", sortBy = "default" }: ProductListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const handleBuyNow = async (product: ProductDisplay) => {
    if (!user) {
      router.push("/auth/login?redirect=/");
      return;
    }

    setBuyingId(product.id);
    try {
      const itemToBuy = { ...product, quantity: 1 };
      
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          total_price: product.price,
          items: [itemToBuy],
          status: "pending",
        }
      ]);

      if (error) throw error;
      router.push("/orders?success=true");
    } catch (err) {
      console.error("Lỗi mua hàng:", err);
      alert("Đã xảy ra lỗi khi tạo đơn hàng, vui lòng thử lại sau.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleAddToCart = (product: ProductDisplay) => {
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter
  const filtered =
    activeCategory === "Tất Cả"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-16 text-center shadow-sm">
        <p className="text-lg font-semibold text-muted-foreground">
          Không có sản phẩm nào
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thử chọn danh mục khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.map((product, index) => {
        const isAdded = addedIds.has(product.id);
        const isWished = wishlist.has(product.id);

        return (
          <div
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {/* Badges */}
              {(product.isNew || product.isSale) && (
                <div className="absolute left-2 top-2 z-10 flex gap-1">
                  {product.isNew && (
                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Mới
                    </span>
                  )}
                  {product.isSale && (
                    <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Giảm Giá
                    </span>
                  )}
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                  isWished
                    ? "bg-red-500 text-white"
                    : "bg-background/80 text-foreground hover:bg-red-500 hover:text-white"
                }`}
                aria-label="Thêm vào yêu thích"
              >
                <Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} />
              </button>

              {/* Product Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={index < 4}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-4">
              {/* Meta row */}
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{product.rating}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>
              </div>

              <h3 className="mb-2 text-base font-bold leading-tight text-foreground line-clamp-1">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                {product.isSale && (
                  <span className="text-xs text-muted-foreground line-through">
                    {(product.price * 1.25).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <Button
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md active:scale-95 transition-all duration-300"
                  size="sm"
                  disabled={buyingId === product.id}
                >
                  {buyingId === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {user ? "Mua Hàng" : "Đăng Nhập để Mua"}
                </Button>

                <Button
                  onClick={() => handleAddToCart(product)}
                  variant={isAdded ? "default" : "outline"}
                  className={`w-full transition-all duration-300 active:scale-95 ${
                    isAdded
                      ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
                      : "border-primary/20 hover:bg-muted"
                  }`}
                  size="sm"
                >
                  {isAdded ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Đã Thêm Vào Giỏ!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm Vào Giỏ
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
