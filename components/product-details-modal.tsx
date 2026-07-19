"use client";

import React from "react";
import { X, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";

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

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onCheckout: (product: Product) => void;
}

export default function ProductDetailsModal({ product, onClose, onCheckout }: ProductDetailsModalProps) {
  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-zinc-950/95 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col sm:flex-row transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image */}
        <div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto bg-zinc-950 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden pointer-events-none" />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] sm:max-h-none space-y-6">
          <div className="space-y-4">
            {/* Category tag & stock indicator */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-blue-400 rounded-full border border-zinc-800">
                {product.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                In Stock & Ready
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {product.name}
            </h3>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-current" : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-300 font-bold">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500">
                | {product.reviewsCount} verified reviews
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                Craftsmanship & Details
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details Points */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Free Insured Worldwide Shipping (3-5 business days)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Genuine lifetime guarantee & authenticity certified</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <RotateCcw className="w-4 h-4 text-blue-400" />
                <span>30-day hassle-free return window</span>
              </div>
            </div>
          </div>

          {/* Pricing and Action Buttons */}
          <div className="border-t border-zinc-850 pt-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-zinc-400">Total Price</span>
              <span className="text-3xl font-black text-white tracking-tight">
                {formattedPrice}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert("Added to Cart! (Demo simulation only)")}
                className="w-full py-4 rounded-2xl font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2"
              >
                Add to Shopping Bag
              </button>
              <button
                onClick={() => onCheckout(product)}
                className="w-full py-4 rounded-2xl font-bold bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850 transition-colors"
              >
                Instant Buy
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
