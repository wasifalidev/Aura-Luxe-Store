<div align="center">

# ✦ Aura Luxe

### A Premium Next.js E-Commerce Store

*Built as a Web & App Development Assignment*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com)

</div>

---

## 📖 Overview

**Aura Luxe** is a beautifully crafted, fully responsive e-commerce web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It features a cinematic GSAP-powered 3D animated landing page, a clean light-mode product catalog, local storage product management, and a rich multi-column footer — all without a backend.

This project was built as part of a **Web & App Development course assignment** to demonstrate mastery of modern frontend architecture, animation techniques, state management, and responsive design.

---

## ✨ Features

### 🎬 Cinematic Landing Hero
- Full-screen GSAP 3D animated landing section
- Realistic iPhone mockup with hardware buttons and Dynamic Island
- Mouse-tracked 3D card tilt effect using `requestAnimationFrame`
- Smooth cinematic scroll timeline (hero → card zoom → CTA reveal)
- Floating glass badge indicators with lucide-react SVG icons

### 🛍️ Product Catalog
- Clean warm off-white (`#F7F7F5`) background that makes product images pop
- Responsive CSS grid: 1 → 2 → 3 → 4 columns
- Real-time search bar filtering by name or category
- Sticky category filter tab bar (All, Furniture, Electronics, Accessories, Aromatics, Bags)
- Animated product cards with hover zoom, wishlist heart button, and Quick View overlay

### ➕ Add Products (Teacher / Admin Mode)
- Floating `+` button opens a premium glassmorphic modal form
- Fields: Name, Price, Category, Description, Image
- Two image modes:
  - **Preset gallery** — 6 curated Unsplash luxury product images
  - **Custom upload** — converts local files to Base64 for persistence
- Client-side form validation with red inline error messages
- Products saved instantly to `localStorage` and displayed in the grid

### 🔍 Product Details
- Click any card to open a full detail modal
- Displays: image, category, name, rating, description, shipping/return policies
- Mock "Add to Bag" and "Instant Buy" action buttons

### 📧 Newsletter & Footer
- Email subscription strip with animated input form
- Rich 5-column footer: brand info, social icons (Instagram, X, YouTube), link columns
- Full copyright and policy links row

---

## 🗂️ Project Structure

```
ecommerce/
├── app/
│   ├── globals.css          # Global styles + all cinematic CSS classes
│   ├── layout.tsx           # Root layout with font setup
│   └── page.tsx             # Main page: hero + catalog + footer
│
├── components/
│   ├── ui/
│   │   └── cinematic-landing-hero.tsx  # GSAP 3D animated hero component
│   ├── product-card.tsx                # Animated product grid card
│   ├── product-form.tsx                # Add product modal form
│   └── product-details-modal.tsx       # Product detail inspector
│
├── lib/
│   └── utils.ts             # cn() class merging utility (clsx + tailwind-merge)
│
├── public/                  # Static assets
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 🧰 Tech Stack & Libraries

| Library | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.10 | React framework, App Router, SSR/SSG |
| [React](https://react.dev) | 19.2.4 | UI library, hooks, state management |
| [TypeScript](https://typescriptlang.org) | ^5 | Type safety across all components |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Utility-first styling |
| [GSAP](https://gsap.com) | ^3.15 | Cinematic scroll animations, 3D transforms |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | bundled | Scroll-linked animation timeline |
| [lucide-react](https://lucide.dev) | ^1.23 | SVG icon components |
| [clsx](https://github.com/lukeed/clsx) | ^2.1 | Conditional className merging |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.6 | Merge Tailwind classes without conflicts |

---

## 📚 Concepts Learned

### 1. GSAP & ScrollTrigger
```ts
// Scroll-pinned cinematic timeline
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "+=3500",
    pin: true,    // Pins the element during the scroll distance
    scrub: 1.5,   // Ties animation progress to scroll position
  },
});
```
**What it teaches:** High-performance DOM animations, scroll-linked timelines, `gsap.context()` for cleanup, and `requestAnimationFrame` for 60fps mouse tracking.

---

### 2. localStorage Persistence
```ts
// Save products to the browser's built-in key-value store
localStorage.setItem("aura_luxe_products", JSON.stringify(products));

// Read them back on page load
const stored = localStorage.getItem("aura_luxe_products");
if (stored) setProducts(JSON.parse(stored));
```
**What it teaches:** Browser Web Storage API, JSON serialization/deserialization, and client-side data persistence without a backend.

---

### 3. Base64 Image Upload
```ts
// Convert a local image file to a Base64 data URL string
const reader = new FileReader();
reader.onloadend = () => {
  setUploadedImageBase64(reader.result as string); // "data:image/png;base64,..."
};
reader.readAsDataURL(file);
```
**What it teaches:** The `FileReader` Web API, binary-to-text encoding, and why Base64 is used when you need to store binary data (images) as plain text (in localStorage).

---

### 4. cn() — Class Name Utility
```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage: safely merge conditional Tailwind classes
<div className={cn("px-4 py-2", isActive && "bg-blue-600", className)} />
```
**What it teaches:** How to handle conditional and dynamic Tailwind CSS class merging without class conflicts.

---

### 5. Next.js Hydration & SSR
The app resolves a common hydration mismatch by:
- Moving all dynamic CSS to `globals.css` (no runtime `dangerouslySetInnerHTML` style injection)
- Adding `suppressHydrationWarning` on the `<html>` root in `layout.tsx`
- Wrapping all `localStorage` reads inside `useEffect` (client-only)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone or download the project
cd ecommerce

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build    # Build for production (runs TypeScript check)
npm run start    # Start the production server
npm run lint     # Run ESLint code quality checks
```

---

## 🎨 Design System

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Hero Background | Black | `#000000` |
| Product Section | Warm White | `#F7F7F5` |
| Product Card | White | `#FFFFFF` |
| Footer | Near Black | `#0A0A0A` |
| Accent Primary | Blue | `#2563EB` |
| Accent Secondary | Indigo | `#4F46E5` |

### Page Flow (Dark → Light → Dark)
```
🌑 Cinematic Hero      (black)        — Drama & impact
🌑 Trust Strip         (neutral-950)  — Smooth transition
🌕 Product Catalog     (#F7F7F5)      — Products pop on light bg
🌑 Newsletter Strip    (neutral-900)  — Visual rhythm break
🌑 Rich Footer         (neutral-950)  — Heavy professional anchor
```

---

## 📱 Responsive Design

| Breakpoint | Grid Columns | Layout Notes |
|---|---|---|
| Mobile (`< 640px`) | 1 column | Stacked hero text, vertical form |
| Tablet (`≥ 768px`) | 2 columns | Side-by-side cards, wider nav |
| Desktop (`≥ 1024px`) | 3 columns | Full hero mockup visible |
| Wide (`≥ 1280px`) | 4 columns | Maximum product density |

---

## 🧑‍🏫 For Evaluators

> Click the **floating blue `+` button** in the bottom-right corner to open the **Add Product** form.
>
> - Fill in the product name, price, category, and description
> - Select a preset image or upload your own
> - Click **Publish Product** — it appears in the grid instantly and persists after refresh

Products are stored in **`localStorage`** under the key `aura_luxe_products`. To reset to defaults, open DevTools → Application → Local Storage → delete the key and refresh.

---

## 👨‍💻 Author

**Wasif Ali** — Web & App Development Student

*Built with ❤️ as a Next.js course assignment*

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

</div>
