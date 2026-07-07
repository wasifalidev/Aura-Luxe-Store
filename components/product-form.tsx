"use client";

import React, { useState } from "react";
import { X, Upload, Check } from "lucide-react";

// Pre-seeded high-quality Unsplash image options for quick product creation
const PRESET_IMAGES = [
  {
    id: "chair",
    url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80",
    label: "Minimalist Lounge Chair",
  },
  {
    id: "watch",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    label: "Matte Black Smart Watch",
  },
  {
    id: "lamp",
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    label: "Modern Brass Desk Lamp",
  },
  {
    id: "perfume",
    url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    label: "Aura Noir Eau De Parfum",
  },
  {
    id: "headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    label: "Over-Ear Wireless Headset",
  },
  {
    id: "backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    label: "Premium Leather Backpack",
  },
];

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating: number;
    reviewsCount: number;
  }) => void;
}

export default function ProductForm({ isOpen, onClose, onAddProduct }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Accessories");
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState<"preset" | "upload">("preset");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_IMAGES[0].url);
  const [uploadedImageBase64, setUploadedImageBase64] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Handle local image file upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 2MB.",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, image: "" }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Enter a valid price greater than $0.";
    }
    if (!description.trim()) newErrors.description = "Product description is required.";
    if (imageType === "upload" && !uploadedImageBase64) {
      newErrors.image = "Please upload an image file.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      price: parseFloat(price),
      category,
      description,
      image: imageType === "preset" ? selectedPreset : uploadedImageBase64,
      rating: 5.0, // default rating for newly added items
      reviewsCount: 1, // default review count
    };

    onAddProduct(newProduct);
    
    // Reset form fields
    setName("");
    setPrice("");
    setCategory("Accessories");
    setDescription("");
    setUploadedImageBase64("");
    setSelectedPreset(PRESET_IMAGES[0].url);
    setImageType("preset");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background glassmorphic overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-zinc-950/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Create Premium Product</h3>
            <p className="text-xs text-zinc-400 mt-1">Add items to store dynamically in local storage.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aura Lounge Chair"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name}</p>}
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Price ($ USD)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249.99"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.price}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Aromatics">Aromatics</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed, compelling description of this item's craftsmanship..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.description}</p>}
          </div>

          {/* Product Image Section */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <label className="text-sm font-semibold text-zinc-300">Product Image</label>
              <div className="flex gap-2 text-xs bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setImageType("preset")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    imageType === "preset"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Premium Presets
                </button>
                <button
                  type="button"
                  onClick={() => setImageType("upload")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    imageType === "upload"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Custom Upload
                </button>
              </div>
            </div>

            {/* Presets Selection */}
            {imageType === "preset" && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPreset === preset.url
                        ? "border-blue-500 scale-95"
                        : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-full h-full object-cover"
                    />
                    {selectedPreset === preset.url && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Image File Upload */}
            {imageType === "upload" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-2xl cursor-pointer bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-7 h-7 text-zinc-500 mb-2" />
                      <p className="text-xs text-zinc-400">
                        <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG, or WEBP (Max 2MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadedImageBase64 && (
                  <div className="flex items-center gap-4 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    <img
                      src={uploadedImageBase64}
                      alt="Uploaded preview"
                      className="w-16 h-16 object-cover rounded-lg border border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-300 truncate">Uploaded File Ready</p>
                      <p className="text-[10px] text-zinc-500">Base64 Encoded for Storage</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedImageBase64("")}
                      className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {errors.image && <p className="text-red-400 text-xs mt-1 font-medium">{errors.image}</p>}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-zinc-800 pt-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all duration-200 text-sm shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
