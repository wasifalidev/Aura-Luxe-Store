"use client";

import React, { useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  // Prevent page scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  const shippingFee = subtotal > 500 ? 0 : 10.0;
  const formattedShipping = shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`;

  const taxFee = subtotal * 0.05; // 5% mock tax
  const formattedTax = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(taxFee);

  const total = subtotal + shippingFee + taxFee;
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-zinc-950/95 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl z-10 animate-[slide-in_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/10">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight uppercase">Your Shopping Bag</h3>
            <span className="bg-blue-600/10 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/10 font-black">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Items list) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-850 p-4 rounded-2xl transition-all duration-200"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-zinc-800/80 bg-zinc-950"
                />

                {/* Info & Quantity controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-white leading-tight line-clamp-1 hover:text-blue-400 transition-colors">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-zinc-550 hover:text-red-400 p-0.5 rounded transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                      {item.product.category}
                    </span>
                  </div>

                  {/* Quantity adjust & price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-2 min-w-[16px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-black text-white">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
              <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-650 border border-zinc-800/40">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Your bag is empty</h4>
                <p className="text-xs text-zinc-550 max-w-[200px] leading-relaxed">
                  Start adding products from our signature collections.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold bg-white text-black text-xs hover:bg-zinc-200 transition-colors"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout CTA) */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-zinc-900/25 space-y-4">
            <div className="space-y-2 text-xs text-zinc-450 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200 font-semibold">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-zinc-200 font-semibold">{formattedShipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="text-zinc-200 font-semibold">{formattedTax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-850 border-dashed">
                <span>Order Total</span>
                <span className="text-blue-400">{formattedTotal}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl font-bold bg-white text-black hover:bg-zinc-200 transition-all text-sm flex items-center justify-center gap-2 group shadow-xl shadow-black/40"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Slide-in Keyframe Injector */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
