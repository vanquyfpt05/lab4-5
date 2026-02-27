"use client";

import { useState } from "react";
import { ProductList } from "@/components/ProductList";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Tất Cả", "Âm Thanh", "Phụ Kiện", "Gaming", "Màn Hình", "Wearables"];

export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [sortBy, setSortBy] = useState("default");

  return (
    <div id="products">
      {/* Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductList activeCategory={activeCategory} sortBy={sortBy} />
    </div>
  );
}
