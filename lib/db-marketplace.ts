import { ProductItem } from "@/types";

const productsStore: Map<string, ProductItem> = new Map();

const initialProducts: ProductItem[] = [
  {
    id: "prod_1",
    title: "Neo-Tokyo Anamorphic LUT Pack",
    description: "12 precision 3D LUTs calibrated for Sony S-Log3, Canon Log, and ARRI LogC3. Designed specifically for nighttime neon cityscapes and cinematic contrast.",
    creator: {
      id: "usr_creator_01",
      username: "alex_rivers",
      displayName: "Alex Rivers 🎬",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    price: 29,
    category: "LUTS",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 142,
    downloadsCount: 1840,
    features: ["12 .CUBE 33x & 65x LUTs", "DaVinci Resolve PowerGrades", "Premiere & Final Cut compatible", "Skin tone protection curve"],
  },
  {
    id: "prod_2",
    title: "Moody Film Look Lightroom Profiles",
    description: "Emulates vintage 35mm film grain, gentle highlight compression, and organic shadows for street and portrait photography.",
    creator: {
      id: "usr_photog_03",
      username: "kenji_shoots",
      displayName: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    price: 19,
    category: "PRESETS",
    thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 96,
    downloadsCount: 2410,
    features: ["8 Desktop & Mobile XMP Presets", "Custom Grain Profiles", "Installation video guide", "RAW + JPEG support"],
  },
  {
    id: "prod_3",
    title: "Next.js 16 Social Platform Architecture Kit",
    description: "Production-ready social media platform boilerplate with Turbopack, React 19, Tailwind CSS 4, Prisma schema, and modular AI studio harness.",
    creator: {
      id: "usr_coder_02",
      username: "maya_dev",
      displayName: "Maya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    price: 0,
    category: "TEMPLATES",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 312,
    downloadsCount: 5890,
    features: ["Complete Next.js 16 App Router", "Dark-first Tailwind 4 styles", "Modular AI Service layer", "Zero external DB lock-in"],
  },
  {
    id: "prod_4",
    title: "Cyberpunk Modular Synthesizer Sample Pack",
    description: "Over 250 royalty-free analog synth loops, sub-bass 808s, and ambient cyber soundscapes recorded directly from Dave Smith Prophet 6.",
    creator: {
      id: "usr_audio_04",
      username: "elena_sound",
      displayName: "Elena Rostova 🎵",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isCreator: true,
    },
    price: 15,
    category: "TEMPLATES",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 78,
    downloadsCount: 1120,
    features: ["250+ 24-bit 48kHz WAV files", "BPM & Key labeled", "Compatible with Ableton, Logic, FL", "100% Royalty Free"],
  },
];

initialProducts.forEach((p) => productsStore.set(p.id, p));

export const dbMarketplace = {
  getProducts: async (category?: string): Promise<ProductItem[]> => {
    let list = Array.from(productsStore.values());
    if (category && category !== "ALL") {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  },

  getProductById: async (id: string): Promise<ProductItem | null> => {
    return productsStore.get(id) || null;
  },

  createProduct: async (
    creator: ProductItem["creator"],
    title: string,
    description: string,
    price: number,
    category: ProductItem["category"],
    thumbnailUrl: string,
    features: string[]
  ): Promise<ProductItem> => {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProduct: ProductItem = {
      id,
      title,
      description,
      creator,
      price,
      category,
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      rating: 5.0,
      reviewsCount: 1,
      downloadsCount: 1,
      features,
    };

    productsStore.set(id, newProduct);
    return newProduct;
  },
};
