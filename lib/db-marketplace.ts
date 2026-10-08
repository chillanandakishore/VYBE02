import { ProductItem } from "@/types";

const productsStore: Map<string, ProductItem> = new Map();

const initialProducts: ProductItem[] = [];

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
