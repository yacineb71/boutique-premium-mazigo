import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

// Mock data - À remplacer par des données réelles de la base de données
const PRODUCTS = [
  {
    id: 1,
    name: "T-Shirt Premium Bleu",
    category: "Vêtements",
    price: 29.99,
    image: "👕",
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: 2,
    name: "Crème Hydratante Luxe",
    category: "Cosmétiques",
    price: 49.99,
    image: "💄",
    rating: 4.8,
    reviews: 256,
    inStock: true,
  },
  {
    id: 3,
    name: "Sac à Main Élégant",
    category: "Accessoires",
    price: 89.99,
    image: "👜",
    rating: 4.6,
    reviews: 89,
    inStock: true,
  },
  {
    id: 4,
    name: "Montre Classique",
    category: "Accessoires",
    price: 199.99,
    image: "⌚",
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: 5,
    name: "Parfum Premium",
    category: "Cosmétiques",
    price: 79.99,
    image: "🌹",
    rating: 4.9,
    reviews: 342,
    inStock: true,
  },
  {
    id: 6,
    name: "Ceinture Cuir",
    category: "Accessoires",
    price: 39.99,
    image: "🎀",
    rating: 4.4,
    reviews: 67,
    inStock: true,
  },
  {
    id: 7,
    name: "Jeans Slim Fit",
    category: "Vêtements",
    price: 59.99,
    image: "👖",
    rating: 4.5,
    reviews: 203,
    inStock: true,
  },
  {
    id: 8,
    name: "Robe Soirée",
    category: "Vêtements",
    price: 129.99,
    image: "👗",
    rating: 4.8,
    reviews: 178,
    inStock: true,
  },
  {
    id: 9,
    name: "Peluche Douce",
    category: "Jouets",
    price: 24.99,
    image: "🧸",
    rating: 4.6,
    reviews: 94,
    inStock: true,
  },
  {
    id: 10,
    name: "Coffret Cadeau Luxe",
    category: "Cadeaux",
    price: 99.99,
    image: "🎁",
    rating: 4.9,
    reviews: 287,
    inStock: true,
  },
  {
    id: 11,
    name: "Chaussures Confort",
    category: "Vêtements",
    price: 79.99,
    image: "👟",
    rating: 4.5,
    reviews: 145,
    inStock: true,
  },
  {
    id: 12,
    name: "Chapeau Élégant",
    category: "Accessoires",
    price: 44.99,
    image: "🎩",
    rating: 4.3,
    reviews: 56,
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
});
