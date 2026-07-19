"use client";

import React, { useState, useEffect } from "react";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import ProductCard from "@/components/product-card";
import ProductForm from "@/components/product-form";
import ProductDetailsModal from "@/components/product-details-modal";
import CheckoutFlow from "@/components/checkout-flow";
import CartDrawer from "@/components/cart-drawer";
import {
  Plus,
  ShoppingBag,
  Grid,
  Sparkles,
  Filter,
  Search,
  Mail,
  ArrowRight,
  Package,
  RefreshCcw,
  Shield,
  Star,
  Check,
  X,
} from "lucide-react";

// Inline SVGs for social icons not available in this lucide-react version
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// Pre-seeded premium products for the store
const INITIAL_PRODUCTS = [
  {
    id: "seed-1",
    name: "Aura Bouclé Lounge Chair",
    price: 599.0,
    category: "Furniture",
    description:
      "An architectural masterpiece designed for absolute relaxation. Features high-density resilient foam upholstered in texture-rich premium bouclé fabric, set upon a sculptural solid walnut base. Perfectly fits modern minimal aesthetics.",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 24,
  },
  {
    id: "seed-2",
    name: "Zenith Matte Smartwatch",
    price: 349.0,
    category: "Accessories",
    description:
      "Seamless brushed titanium casing holding an ultra-bright ambient AMOLED display. Features precise biometric sensors, custom leather straps, and up to 14 days of smart power management. Built for the modern professional.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 18,
  },
  {
    id: "seed-3",
    name: "Opal Brass Desk Lamp",
    price: 189.0,
    category: "Furniture",
    description:
      "Hand-spun solid brass reflector housing that casts a warm, soft glow. Designed to elevate executive workspaces and study chambers. Features a woven fabric cord and weighted iron base for premium tactile presence.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 15,
  },
  {
    id: "seed-4",
    name: "Aura Noir Eau De Parfum",
    price: 120.0,
    category: "Aromatics",
    description:
      "A sophisticated fragrance featuring smoky patchouli, sandalwood notes, and bright bergamot top oils. Crafted in Grasse, France using traditional cold-extraction methods. Presented in an elegant hand-labeled glass bottle.",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    reviewsCount: 42,
  },
  {
    id: "seed-5",
    name: "Carbon Leather Backpack",
    price: 275.0,
    category: "Bags",
    description:
      "Handcrafted using full-grain, vegetable-tanned Italian leather. Features structured internal sleeves for electronic hardware, custom gunmetal buckles, and moisture-wicking ergonomic backing padding.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewsCount: 9,
  },
  {
    id: "seed-6",
    name: "Meridian Over-Ear Headset",
    price: 429.0,
    category: "Electronics",
    description:
      "40mm custom-tuned dynamic drivers with active noise cancellation deliver concert-hall audio. Plush protein-leather ear cushions and a memory foam headband provide all-day comfort. Pairs via Bluetooth 5.3 with multipoint switching.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 31,
  },
];

const CATEGORIES = ["All", "Furniture", "Electronics", "Accessories", "Aromatics", "Bags"];

const FOOTER_LINKS = {
  Shop: ["New Arrivals", "Best Sellers", "Furniture", "Electronics", "Accessories"],
  Company: ["About Aura Luxe", "Sustainability", "Careers", "Press Room"],
  Support: ["Help Center", "Order Tracking", "Returns", "Contact Us"],
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [checkoutProduct, setCheckoutProduct] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ show: true, message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Track page scroll to apply background styling to the fixed nav
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart operations
  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setSelectedProduct(null);
    showToast(`${product.name} added to shopping bag.`, "info");
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = () => {
    setCart([]);
  };

  // Initialize and load products from LocalStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("aura_luxe_products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      localStorage.setItem("aura_luxe_products", JSON.stringify(INITIAL_PRODUCTS));
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const handleAddProduct = (newProduct: any) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("aura_luxe_products", JSON.stringify(updated));
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
          <p className="text-zinc-500 text-xs tracking-widest uppercase">Loading Aura Luxe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — CINEMATIC HERO (dark, full screen, 3D animated)
          The nav floats transparently over it
      ──────────────────────────────────────────────────────────────── */}
      <div className="relative bg-black">
        {/* Floating Sticky Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
          isScrolled 
            ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/85 shadow-lg py-3.5" 
            : "bg-transparent border-b border-transparent py-5"
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-black text-sm">A</span>
              </div>
              <span className="text-white font-black text-xl tracking-widest uppercase">
                Aura Luxe
              </span>
            </div>

            {/* Center links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/60">
              {["Catalog", "Heritage", "Atelier", "Sustainability"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl font-bold text-xs tracking-tight transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                Add Product
              </button>
              <div 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/10 text-white cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* The 3D animated hero */}
        <CinematicHero />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — TRUST STRIP (transition from dark to light)
      ──────────────────────────────────────────────────────────────── */}
      <div className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            {[
              { icon: <Package className="w-4 h-4" />, label: "Free Worldwide Shipping" },
              { icon: <RefreshCcw className="w-4 h-4" />, label: "30-Day Free Returns" },
              { icon: <Shield className="w-4 h-4" />, label: "Lifetime Guarantee" },
              { icon: <Star className="w-4 h-4" />, label: "4.9 ★ Rated by 1,200+" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-neutral-300">
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — PRODUCT CATALOG (clean white/light background)
      ──────────────────────────────────────────────────────────────── */}
      <main id="store-section" className="bg-[#F7F7F5]">

        {/* Catalog Header */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Collection · {products.length} Pieces
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-none">
                Signature<br />
                <span className="text-neutral-400">Products</span>
              </h2>
              <p className="text-neutral-500 text-sm max-w-sm font-light leading-relaxed">
                Meticulously engineered essentials aligned for comfort, visual purity, and longevity.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="sticky top-0 z-30 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap uppercase tracking-wider transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-neutral-900 text-white shadow-md"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-neutral-400 text-xs font-semibold pl-6 border-l border-neutral-200 ml-4 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                {filteredProducts.length} items
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => setSelectedProduct(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-300">
                <Grid className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-neutral-800">Nothing found</h4>
                <p className="text-neutral-400 text-sm mt-1">
                  Try a different filter or add a new product.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-neutral-900 text-white hover:bg-neutral-700 transition-all"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — NEWSLETTER STRIP
      ──────────────────────────────────────────────────────────────── */}
      <div className="bg-neutral-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">
            Join the inner circle
          </p>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            New arrivals, first.
          </h3>
          <p className="text-neutral-400 text-sm font-light leading-relaxed">
            Subscribe for exclusive early access to new collections, private events, and offers reserved for Aura members only.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
              showToast("Thank you! You have been added to the early access list.", "success");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-neutral-900 font-bold text-sm rounded-2xl hover:bg-neutral-100 transition-all shrink-0"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — RICH FOOTER
      ──────────────────────────────────────────────────────────────── */}
      <footer className="bg-neutral-950 border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Footer top: brand + links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">

            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-black text-sm">A</span>
                </div>
                <span className="text-white font-black text-xl tracking-widest uppercase">
                  Aura Luxe
                </span>
              </div>
              <p className="text-neutral-500 text-sm font-light leading-relaxed max-w-xs">
                Curating the world's most thoughtfully designed objects for people who appreciate the intersection of beauty and function.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <InstagramIcon />, href: "#", label: "Instagram" },
                  { icon: <XIcon />, href: "#", label: "X (Twitter)" },
                  { icon: <YoutubeIcon />, href: "#", label: "YouTube" },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>

              {/* Assignment tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Next.js Assignment Project
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section} className="space-y-5">
                <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                  {section}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-neutral-500 hover:text-neutral-100 text-sm transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-neutral-600 text-[11px]">
            <p>© 2026 Aura Luxe. All rights reserved. Built as a Next.js e-commerce assignment.</p>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Sale", "Cookie Settings"].map((item) => (
                <a key={item} href="#" className="hover:text-neutral-300 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Floating Add Product Button ─── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsFormOpen(true)}
          className="group flex items-center gap-2 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110"
          title="Add Custom Product"
          id="floating-add-product-btn"
        >
          <Plus className="w-6 h-6 stroke-[2.5px]" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm pr-1">
            Add Product
          </span>
        </button>
      </div>

      {/* Modals */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onCheckout={(product) => {
          setSelectedProduct(null);
          setCheckoutProduct(product);
          setIsCheckoutOpen(true);
        }}
        onAddToCart={handleAddToCart}
      />
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutProduct(null);
        }}
        product={checkoutProduct}
        cartItems={checkoutProduct ? undefined : cart}
        onOrderSuccess={handleOrderSuccess}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setCheckoutProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Reusable Premium Toast Banner */}
      {toast.show && (
        <div className="fixed top-24 right-6 z-50 animate-[slide-in-right_0.3s_cubic-bezier(0.16,1,0.3,1)] bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl px-5 py-4 rounded-2xl flex items-center gap-3.5 shadow-2xl max-w-sm">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
            toast.type === "success" 
              ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400" 
              : "bg-blue-950/40 border-blue-900/40 text-blue-400"
          }`}>
            {toast.type === "success" ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <h5 className="text-[10px] font-black text-white uppercase tracking-wider">
              {toast.type === "success" ? "Notification" : "Aura Luxe"}
            </h5>
            <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-zinc-550 hover:text-white p-1 ml-auto shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Local keyframes style for slide-in-right animation */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
