"use client";

import React from "react";
import { Star, Eye, Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col bg-white border border-neutral-100 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
    >
      {/* Image wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50">

        {/* Category chip */}
        <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-sm text-neutral-600 rounded-full border border-neutral-100 shadow-sm">
          {product.category}
        </span>

        {/* Wishlist button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-full font-bold text-xs tracking-tight shadow-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </div>
        </div>

        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Card body */}
      <div className="flex flex-col p-5 flex-1 gap-3">
        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? "fill-current" : "text-neutral-200 fill-current"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold">
            {product.rating.toFixed(1)} ({product.reviewsCount})
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-neutral-900 tracking-tight leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h4>

        {/* Description */}
        <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-[10px] text-neutral-400 font-medium block mb-0.5">Price</span>
            <span className="text-lg font-black text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-neutral-900 group-hover:bg-blue-600 text-white text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            View
          </div>
        </div>
      </div>
    </div>
  );
}
