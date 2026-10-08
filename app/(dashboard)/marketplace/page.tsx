"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import {
  ShoppingBag,
  Star,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProductItem } from "@/types";

export default function MarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("29");
  const [newCategory, setNewCategory] = useState("LUTS");
  const [newThumbnail, setNewThumbnail] = useState("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80");
  const [newFeatures, setNewFeatures] = useState("12 Pro Presets, Compatible with DaVinci 19, Rec.709 & Log files");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === "ALL" ? "/api/marketplace" : `/api/marketplace?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handlePurchase = (product: ProductItem) => {
    toast({
      type: "success",
      title: "Purchase Complete! 🎉",
      message: `Downloaded license & archive for "${product.title}". Check your downloads.`,
    });
    setSelectedProduct(null);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      toast({ type: "error", title: "Please fill out required fields" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          price: parseFloat(newPrice) || 0,
          category: newCategory,
          thumbnailUrl: newThumbnail.trim(),
          features: newFeatures.split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.product) {
        setProducts([data.product, ...products]);
        setIsPublishModalOpen(false);
        setNewTitle("");
        setNewDesc("");
        toast({
          type: "success",
          title: "Product Published!",
          message: "Your digital asset is now live in the VYBE Marketplace.",
        });
      } else {
        toast({ type: "error", title: data.message || "Failed to publish" });
      }
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Publish error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creator.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const categories = [
    { id: "ALL", label: "All Items" },
    { id: "PRESETS", label: "Lightroom Presets" },
    { id: "LUTS", label: "DaVinci LUTs" },
    { id: "TEMPLATES", label: "Code & Web" },
    { id: "3D_ASSETS", label: "Blender 3D" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">
              <ShoppingBag className="w-3.5 h-3.5 text-violet-400" /> Digital Goods Store
            </Badge>
            <span className="text-[11px] text-neutral-400 font-medium">Instant Licensing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            VYBE Creator Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Curated LUT packs, Lightroom presets, motion design templates, and production-grade code
            assets from top verified creators.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setIsPublishModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish Digital Asset
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? "bg-violet-600 text-white font-bold"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets or creators..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-neutral-500">Loading marketplace items...</div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
          <p className="text-sm font-semibold text-white mb-1">No products found</p>
          <p className="text-xs text-neutral-400 mb-4">
            Try adjusting your search query or clear category filters.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setSelectedCategory("ALL")}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <Card
              key={p.id}
              className="group overflow-hidden bg-neutral-900/60 border-neutral-800 hover:border-violet-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden relative bg-neutral-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/10 uppercase">
                    {p.category.replace("_", " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Avatar src={p.creator.avatarUrl} name={p.creator.displayName} size="xs" />
                    <span className="truncate">{p.creator.displayName}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-amber-400 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{p.rating}</span>
                    <span className="text-[11px] text-neutral-500">({p.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 border-t border-neutral-800/60 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                    Price
                  </span>
                  <span className="text-base font-black text-white">
                    {p.price === 0 ? "Free" : `$${p.price.toFixed(2)}`}
                  </span>
                </div>

                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setSelectedProduct(p)}
                  rightIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Get Asset
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Detail & Checkout Modal */}
      {selectedProduct && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          title="Digital Asset Licensing"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-neutral-800 relative bg-neutral-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.thumbnailUrl}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white">{selectedProduct.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar
                    src={selectedProduct.creator.avatarUrl}
                    name={selectedProduct.creator.displayName}
                    size="xs"
                  />
                  <span className="text-xs text-neutral-300">
                    By <strong>{selectedProduct.creator.displayName}</strong>
                  </span>
                  <span className="text-neutral-500">•</span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  Personal & Commercial License
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Product Description
              </h4>
              <p>{selectedProduct.description}</p>
            </div>

            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Included In This Pack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant instant ZIP file delivery
              </span>
              <span className="text-[11px] text-neutral-500">Stripe & PayPal ready</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="md"
                onClick={() => handlePurchase(selectedProduct)}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Now (${selectedProduct.price.toFixed(2)})
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Creator Publish Product Modal */}
      {isPublishModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPublishModalOpen(false)}
          title="Publish Digital Creator Asset"
        >
          <form onSubmit={handlePublish} className="space-y-4">
            <Input
              label="Asset Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Cinema Bloom Pro LUTs"
              required
            />

            <Textarea
              label="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe color science, camera sensor compatibility, workflows..."
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-300 font-medium block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                >
                  <option value="PRESETS">Lightroom Presets</option>
                  <option value="LUTS">DaVinci LUTs</option>
                  <option value="TEMPLATES">Code / Web Templates</option>
                  <option value="3D_ASSETS">3D Assets</option>
                  <option value="AUDIO_PACKS">Audio / Sound FX</option>
                </select>
              </div>

              <Input
                label="Price (USD)"
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="29"
                required
              />
            </div>

            <Input
              label="Cover Image URL"
              value={newThumbnail}
              onChange={(e) => setNewThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />

            <Input
              label="Features (comma separated)"
              value={newFeatures}
              onChange={(e) => setNewFeatures(e.target.value)}
              placeholder="12 .cube files, Rec.709, Arri LogC support"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="sm"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Publish to Marketplace
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
