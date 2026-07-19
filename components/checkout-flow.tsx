"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, CreditCard, Truck, Calendar, User, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";

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

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  cartItems?: CartItem[];
  onOrderSuccess?: () => void;
}

// Confetti Particle Class for Canvas Confetti
class ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;

  constructor(canvasWidth: number) {
    this.x = Math.random() * canvasWidth;
    this.y = -10 - Math.random() * 20;
    this.size = Math.random() * 8 + 5;
    const colors = ["#3b82f6", "#60a5fa", "#818cf8", "#4f46e5", "#10b981", "#fbbf24", "#f43f5e"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 4 + 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
  }

  update(canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    return this.y < canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

export default function CheckoutFlow({ isOpen, onClose, product, cartItems, onOrderSuccess }: CheckoutFlowProps) {
  // Checkout steps: 1 = Shipping, 2 = Payment, 3 = Processing, 4 = Success
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  
  // Shipping Form State
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
  });
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Credit Card Form State
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Processing State
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("Initializing payment details...");
  const processingRef = useRef<number | null>(null);

  // Confetti Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep(1);
      setPaymentMethod("card");
      setShipping({ name: "", email: "", address: "", city: "" });
      setCard({ number: "", name: "", expiry: "", cvv: "" });
      setShippingErrors({});
      setCardErrors({});
      setProcessingProgress(0);
      if (processingRef.current) {
        clearInterval(processingRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  }, [isOpen]);

  // Run Canvas Confetti loop when step is Success (Step 4)
  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const particles: ConfettiParticle[] = [];
      
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles periodically
        if (particles.length < 120 && Math.random() < 0.4) {
          particles.push(new ConfettiParticle(canvas.width));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          const keep = p.update(canvas.height);
          if (keep) {
            p.draw(ctx);
          } else {
            particles.splice(i, 1);
          }
        }

        animationFrameIdRef.current = requestAnimationFrame(render);
      };
      
      render();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }
  }, [step]);

  if (!isOpen || (!product && (!cartItems || cartItems.length === 0))) return null;

  // Formatted Pricing
  const subtotal = product 
    ? product.price 
    : (cartItems ? cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : 0);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  const shippingFee = subtotal > 500 ? 0 : 10.0;
  const formattedShipping = shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`;

  const taxFee = subtotal * 0.05;
  const formattedTax = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(taxFee);

  const total = subtotal + shippingFee + taxFee;
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  // Validation functions
  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shipping.name.trim()) errs.name = "Full name is required";
    if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) errs.email = "Valid email is required";
    if (!shipping.address.trim()) errs.address = "Shipping address is required";
    if (!shipping.city.trim()) errs.city = "City is required";
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCard = () => {
    if (paymentMethod === "cod") return true;
    const errs: Record<string, string> = {};
    const sanitizedCard = card.number.replace(/\s+/g, "");
    if (sanitizedCard.length !== 16 || isNaN(Number(sanitizedCard))) {
      errs.number = "Enter a valid 16-digit card number";
    }
    if (!card.name.trim()) errs.name = "Cardholder name is required";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      errs.expiry = "Use MM/YY format";
    } else {
      const [month, year] = card.expiry.split("/").map(Number);
      if (month < 1 || month > 12) {
        errs.expiry = "Invalid month";
      }
    }
    if (card.cvv.length !== 3 || isNaN(Number(card.cvv))) {
      errs.cvv = "Invalid CVV (3 digits)";
    }
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step transitions
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      setStep(3);
      startProcessing();
    }
  };

  const startProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setProcessingProgress(progress);
      
      if (progress < 30) {
        setProcessingMessage("Authenticating delivery logistics...");
      } else if (progress < 65) {
        setProcessingMessage(paymentMethod === "card" ? "Securing payment channel & verifying card..." : "Registering Cash on Delivery details...");
      } else if (progress < 90) {
        setProcessingMessage("Encrypting ledger invoice & saving transaction...");
      } else {
        setProcessingMessage("Order placed successfully!");
      }

      if (progress >= 100) {
        clearInterval(interval);
        setStep(4);
        if (onOrderSuccess) {
          onOrderSuccess();
        }
      }
    }, 45); // Takes about 4.5 seconds
    processingRef.current = interval as unknown as number;
  };

  // Card input autospacing & formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    // Add space every 4 digits
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCard({ ...card, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCard({ ...card, expiry: val });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.slice(0, 3);
    setCard({ ...card, cvv: val });
  };

  // Order Details Generator
  const orderId = `AL-${Math.floor(100000 + Math.random() * 900000)}`;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={step < 3 ? onClose : undefined} />

      {/* Checkout Window */}
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:h-[620px] transition-all duration-300">
        
        {/* Confetti canvas for Success state */}
        {step === 4 && <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full" />}

        {/* Close Button */}
        {step < 3 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: Checkout Info / Cart Item (Hidden in Success step for better focus) */}
        {step < 4 && (
          <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-zinc-850 p-6 sm:p-8 flex flex-col justify-between bg-zinc-900/30">
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-white tracking-tight uppercase border-b border-zinc-800 pb-3">Checkout Details</h3>
              
              {/* Product preview */}
              {product ? (
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-zinc-800"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{product.category}</span>
                    <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-zinc-500 font-medium">Qty: 1</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {cartItems?.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center border-b border-zinc-900 pb-2.5 last:border-b-0 last:pb-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-zinc-800 bg-zinc-950"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <div className="flex justify-between text-[10px] text-zinc-550 font-bold mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.product.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order breakdown */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/60">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-200">{formattedPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Insured Shipping</span>
                  <span className="font-semibold text-zinc-200">{formattedShipping}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>VAT / Local Tax (5%)</span>
                  <span className="font-semibold text-zinc-200">{formattedTax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-zinc-800 border-dashed">
                  <span>Total Amount</span>
                  <span className="text-blue-400">{formattedTotal}</span>
                </div>
              </div>
            </div>

            {/* Bottom info badges */}
            <div className="hidden md:flex flex-col gap-2.5 pt-6 text-[10px] text-zinc-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>SSL Secured Checkout Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Express courier tracking active</span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Interactive Form Content */}
        <div className={`w-full ${step === 4 ? "md:w-full" : "md:w-3/5"} p-6 sm:p-8 flex flex-col justify-center overflow-y-auto`}>
          
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 1 of 2</span>
                <h3 className="text-2xl font-black text-white tracking-tight">Delivery Address</h3>
                <p className="text-xs text-zinc-500">Provide recipient credentials for dispatch tracking.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                  {shippingErrors.name && <p className="text-red-400 text-xs mt-1">{shippingErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="johndoe@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                  {shippingErrors.email && <p className="text-red-400 text-xs mt-1">{shippingErrors.email}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="123 Luxury Ave"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    {shippingErrors.address && <p className="text-red-400 text-xs mt-1">{shippingErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">City</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="New York"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    {shippingErrors.city && <p className="text-red-400 text-xs mt-1">{shippingErrors.city}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all text-sm flex items-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD & INTERACTIVE CREDIT CARD OR COD */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 2 of 2</span>
                <h3 className="text-2xl font-black text-white tracking-tight">Payment Setup</h3>
                <p className="text-xs text-zinc-500">Choose your preferred transaction pipeline.</p>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    paymentMethod === "card"
                      ? "bg-zinc-800 text-white border border-zinc-700/50 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    paymentMethod === "cod"
                      ? "bg-zinc-800 text-white border border-zinc-700/50 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Cash on Delivery
                </button>
              </div>

              {/* Conditional Panels */}
              {paymentMethod === "card" ? (
                <div className="space-y-5">
                  {/* Credit Card Mockup Visual */}
                  <div className="relative w-full h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-950 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl border border-blue-500/20 overflow-hidden transform-style-3d transition-transform duration-500">
                    <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-blue-200 font-extrabold uppercase tracking-widest leading-none mb-0.5">Luxury Class</span>
                        <span className="text-sm font-extrabold tracking-wider leading-none">AURA CARD</span>
                      </div>
                      {/* Interactive chip mockup */}
                      <div className="w-8 h-6 bg-gradient-to-r from-amber-400 to-amber-300 rounded-md border border-amber-500/20 opacity-90 shadow-inner flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 w-6 h-4 opacity-50">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="border-r border-b border-amber-900" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="text-lg font-mono font-medium tracking-[0.15em] text-center my-2">
                      {card.number || "•••• •••• •••• ••••"}
                    </div>

                    {/* Card Footer Details */}
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-blue-200 uppercase tracking-widest">Cardholder</span>
                        <span className="text-xs font-bold uppercase truncate max-w-[180px]">{card.name || "YOUR NAME HERE"}</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col text-right">
                          <span className="text-[7px] text-blue-200 uppercase tracking-widest">Expires</span>
                          <span className="text-xs font-mono font-bold">{card.expiry || "MM/YY"}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[7px] text-blue-200 uppercase tracking-widest">CVV</span>
                          <span className="text-xs font-mono font-bold">{card.cvv || "•••"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase">Card Number</label>
                      <input
                        type="text"
                        required
                        value={card.number}
                        onChange={handleCardNumberChange}
                        onFocus={() => setFocusedField("number")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs"
                      />
                      {cardErrors.number && <p className="text-red-400 text-[10px] mt-1 font-semibold">{cardErrors.number}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs"
                      />
                      {cardErrors.name && <p className="text-red-400 text-[10px] mt-1 font-semibold">{cardErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase">Expiry Date</label>
                        <input
                          type="text"
                          required
                          value={card.expiry}
                          onChange={handleExpiryChange}
                          onFocus={() => setFocusedField("expiry")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="MM/YY"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs"
                        />
                        {cardErrors.expiry && <p className="text-red-400 text-[10px] mt-1 font-semibold">{cardErrors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase">Security Code (CVV)</label>
                        <input
                          type="password"
                          required
                          value={card.cvv}
                          onChange={handleCvvChange}
                          onFocus={() => setFocusedField("cvv")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="000"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs font-mono"
                        />
                        {cardErrors.cvv && <p className="text-red-400 text-[10px] mt-1 font-semibold">{cardErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Cash on Delivery illustration and prompt */
                <div className="space-y-4 py-2">
                  <div className="bg-zinc-900/50 border border-zinc-850 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                    <div className="w-16 h-16 rounded-full bg-blue-950/40 text-blue-400 border border-blue-900/40 flex items-center justify-center shadow-lg shadow-black/30">
                      <Truck className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white">No Payment Required Now</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                        You have selected **Cash on Delivery**. You will pay the courier amount in cash when the product reaches your doorstep.
                      </p>
                    </div>
                    
                    {/* Trust badges */}
                    <div className="pt-2 flex items-center gap-3 justify-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                        Zero prepayment
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                        Safe delivery
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-zinc-950/60 p-4 border border-zinc-850 rounded-xl text-zinc-400">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-normal font-light">
                      <span className="font-semibold text-zinc-300">Notice:</span> A representative will contact you via your address coordinates/email prior to shipment processing to confirm delivery details.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-zinc-500 hover:text-white text-xs font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white transition-all text-sm shadow-lg shadow-blue-900/30 flex items-center gap-2"
                >
                  {paymentMethod === "card" ? "Confirm Payment" : "Place Order (COD)"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-8 text-center">
              {/* Circular timeline loader */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                  <circle
                    className="progress-ring stroke-blue-500"
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    strokeWidth="6"
                    style={{
                      strokeDasharray: 352,
                      strokeDashoffset: 352 - (352 * processingProgress) / 100,
                      transition: "stroke-dashoffset 0.1s ease-out",
                    }}
                  />
                </svg>
                <div className="text-center z-10 flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">{processingProgress}%</span>
                  <span className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-widest mt-0.5">Status</span>
                </div>
              </div>

              {/* Status Log Messages */}
              <div className="space-y-2 max-w-sm">
                <h4 className="text-lg font-bold text-white animate-pulse">Placing Order...</h4>
                <p className="text-xs text-zinc-400 font-medium h-8 flex items-center justify-center">
                  {processingMessage}
                </p>
              </div>

              {/* Visual Secure Handoff */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SSL Encrypted Pipeline Secure</span>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER PLACED SUCCESS SCREEN */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center py-8 space-y-8 z-30">
              
              {/* Draw Checkmark SVG */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-800/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/20 transform scale-100 animate-[bounce_0.6s_ease-out]">
                <svg className="w-12 h-12 text-emerald-400 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" className="animate-[draw-check_0.8s_ease-out_0.2s_both]" style={{ strokeDasharray: 30, strokeDashoffset: 30 }} />
                </svg>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Main Headers */}
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">Success confirmation</span>
                <h3 className="text-3xl font-black text-white tracking-tight">Order Placed Successfully!</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
                  Thank you for shopping at Aura Luxe. Your custom order request has been logged and dispatch procedures have commenced.
                </p>
              </div>

              {/* Transaction details block */}
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-3.5 text-left text-xs text-zinc-400 shadow-inner">
                <div className="flex justify-between">
                  <span>Order Identifier</span>
                  <span className="font-mono font-bold text-white">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Recipient</span>
                  <span className="font-bold text-white">{shipping.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Address</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{shipping.address}, {shipping.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-bold text-white uppercase">{paymentMethod === "card" ? "Credit Card" : "Cash on Delivery (COD)"}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-800/80 text-zinc-300 font-semibold">
                  <span>Estimated Delivery</span>
                  <span className="text-blue-400">{formattedDelivery}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={onClose}
                className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 text-sm"
              >
                Continue Shopping
              </button>

            </div>
          )}

        </div>
      </div>
      
      {/* Dynamic Keyframes injected locally for Checkmark Draw animation */}
      <style>{`
        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
