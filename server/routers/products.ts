import { adminProcedure, router, publicProcedure } from "../_core/trpc";
import { getProductSupplierMeta, upsertProductSupplierMeta } from "../db";
import { z } from "zod";

// Mock data - À remplacer par des données réelles de la base de données
const PRODUCTS = [
  {
    id: 1,
    name: "T-Shirt Premium Bleu",
    category: "Vêtements",
    price: 29.99,
    image: "👕",
    popularityRank: 12,
    inStock: true,
  },
  {
    id: 2,
    name: "Crème Hydratante Luxe",
    category: "Cosmétiques",
    price: 49.99,
    image: "💄",
    popularityRank: 11,
    inStock: true,
  },
  {
    id: 3,
    name: "Sac à Main Élégant",
    category: "Accessoires",
    price: 89.99,
    image: "👜",
    popularityRank: 9,
    inStock: true,
  },
  {
    id: 4,
    name: "Montre Classique",
    category: "Accessoires",
    price: 199.99,
    image: "⌚",
    popularityRank: 10,
    inStock: true,
  },
  {
    id: 5,
    name: "Parfum Premium",
    category: "Cosmétiques",
    price: 79.99,
    image: "🌹",
    popularityRank: 8,
    inStock: true,
  },
  {
    id: 6,
    name: "Ceinture Cuir",
    category: "Accessoires",
    price: 39.99,
    image: "🎀",
    popularityRank: 7,
    inStock: true,
  },
  {
    id: 7,
    name: "Jeans Slim Fit",
    category: "Vêtements",
    price: 59.99,
    image: "👖",
    popularityRank: 6,
    inStock: true,
  },
  {
    id: 8,
    name: "Robe Soirée",
    category: "Vêtements",
    price: 129.99,
    image: "👗",
    popularityRank: 5,
    inStock: true,
  },
  {
    id: 9,
    name: "Peluche Douce",
    category: "Jouets",
    price: 24.99,
    image: "🧸",
    popularityRank: 4,
    inStock: true,
  },
  {
    id: 10,
    name: "Coffret Cadeau Luxe",
    category: "Cadeaux",
    price: 99.99,
    image: "🎁",
    popularityRank: 3,
    inStock: true,
  },
  {
    id: 11,
    name: "Chaussures Confort",
    category: "Vêtements",
    price: 79.99,
    image: "👟",
    popularityRank: 2,
    inStock: true,
  },
  {
    id: 12,
    name: "Chapeau Élégant",
    category: "Accessoires",
    price: 44.99,
    image: "🎩",
    popularityRank: 1,
    inStock: true,
  },
];

export const productsRouter = router({
  getAll: publicProcedure.query(async () => {
    return PRODUCTS;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return PRODUCTS.find((p) => p.id === input.id) || null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return PRODUCTS.filter((p) => p.category === input.category);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const query = input.query.toLowerCase();
      return PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }),

  getCategories: publicProcedure.query(async () => {
    return ["Vêtements", "Cosmétiques", "Accessoires", "Cadeaux", "Jouets"];
  }),

  adminSupplierMeta: adminProcedure.input(z.object({ productId: z.number().int().positive() })).query(({ input }) => getProductSupplierMeta(input.productId)),

  upsertSupplierMeta: adminProcedure
    .input(z.object({
      productId: z.number().int().positive(),
      supplierUrl: z.string().url().nullable().optional(),
      supplierSku: z.string().max(255).nullable().optional(),
      supplierCost: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable().optional(),
      notes: z.string().max(5000).nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      await upsertProductSupplierMeta(input);
      return { success: true } as const;
    }),
});
