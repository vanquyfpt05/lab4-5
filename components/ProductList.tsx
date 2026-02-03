"use client";

import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product, useCart } from "@/hooks/use-cart";
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
    image: "/watch.jpg",
    category: "Wearables",
    rating: 4.7,
    reviews: 89,
    isNew: true,
  },
  {
    id: 6,
    name: "Webcam HD 1080p",
    price: 1290000,
    image: "/webcam.jpg",
    category: "Phụ Kiện",
    rating: 4.5,
    reviews: 42,
  },
  {
    id: 7,
    name: "Đế Tản Nhiệt Laptop",
    price: 590000,
    image: "/cooling-pad.jpg",
    category: "Phụ Kiện",
    rating: 4.6,
    reviews: 156,
    isSale: true,
  },
  {
    id: 8,
    name: "Micro Thu Âm USB",
    price: 2490000,
    image: "/microphone.jpg",
    category: "Âm Thanh",
    rating: 4.8,
    reviews: 73,
  },
];

export function ProductList() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: ProductDisplay) => {
    addToCart(product);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
        >
          {/* Image Container - Aspect 4:3 for better balance */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {/* Badges */}
            {(product.isNew || product.isSale) && (
              <div className="absolute left-2 top-2 z-10 flex gap-1">
                {product.isNew && (
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Mới
                  </span>
                )}
                {product.isSale && (
                  <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Giảm Giá
                  </span>
                )}
              </div>
            )}

            {/* Quick Actions (Optional, kept subtle) */}
            <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
               <button 
                className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
                aria-label="Add to wishlist"
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
            </div>

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
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">{product.rating}</span>
              </div>
            </div>

            <h3 className="mb-2 text-base font-bold leading-tight text-foreground line-clamp-1">
              {product.name}
            </h3>

            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
              {product.isSale && (
                <span className="text-xs text-muted-foreground line-through">
                  {(product.price * 1.25).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              )}
            </div>

            <div className="mt-auto">
                <Button 
                onClick={() => handleAddToCart(product)} 
                className="w-full gap-2 transition-transform active:scale-95" 
                size="sm"
                >
                <ShoppingCart className="h-4 w-4" />
                Thêm vào giỏ
                </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
