import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import {
  buildCatalogRoute,
  getCatalogSortParam,
  getSearchParam,
  matchesCatalogSearch,
  sortCatalogProducts,
  type CatalogSort,
} from "@/lib/catalogSearch";
import { Link, useLocation } from "wouter";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
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

const categories = ["Vêtements", "Cosmétiques", "Accessoires", "Cadeaux", "Jouets"];

function getShopQuerySource(location: string): string {
  if (typeof window !== "undefined" && window.location.search) {
    return `${location.split("?", 1)[0]}${window.location.search}`;
  }
  return location;
}

function getCategoryParam(location: string): string | null {
  const category = new URLSearchParams(location.split("?", 2)[1] ?? "").get("category");
  return categories.find((item) => item.toLowerCase() === category?.toLowerCase()) ?? null;
}

export default function Shop() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() =>
    getCategoryParam(getShopQuerySource(location)),
  );
  const [searchTerm, setSearchTerm] = useState(() => getSearchParam(getShopQuerySource(location)));
  const [sortOption, setSortOption] = useState<CatalogSort>(() =>
    getCatalogSortParam(getShopQuerySource(location)),
  );
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const querySource = getShopQuerySource(location);
    setSearchTerm(getSearchParam(querySource));
    setSelectedCategory(getCategoryParam(querySource));
    setSortOption(getCatalogSortParam(querySource));
  }, [location]);

  const navigateWithFilters = ({
    category = selectedCategory,
    search = searchTerm,
    sort = sortOption,
  }: {
    category?: string | null;
    search?: string;
    sort?: CatalogSort;
  } = {}) => {
    setLocation(buildCatalogRoute({ searchTerm: search, category, sort }));
  };

  const filteredProducts = sortCatalogProducts(
    PRODUCTS.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = matchesCatalogSearch(`${product.name} ${product.category}`, searchTerm);
      return matchesCategory && matchesSearch;
    }),
    sortOption,
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ef] text-[#211e1b]">
      <Header />

      <section className="bg-[#ede7de] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="mazigho-eyebrow mb-3">EXPLORER MAZIGHO</p>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.03em] text-[#211e1b]">Notre Boutique</h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-[#6d6259]">Découvrez une sélection de trouvailles pensées pour accompagner chaque moment du quotidien.</p>
        </div>
      </section>

      <section className="sticky top-[7.1rem] z-40 border-b border-[#ded5ca] bg-[#fbf9f5]/95 px-4 py-6 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-[#d5cec4] bg-white px-5 py-3 text-[#211e1b] outline-none placeholder:text-[#8b8178] focus:ring-2 focus:ring-[#c56f4b]"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  navigateWithFilters({ category: null });
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === null
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    navigateWithFilters({ category: cat });
                  }}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-[#211e1b] text-white"
                        : "bg-[#eee8df] text-[#514942] hover:bg-[#e3d9cd]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 md:shrink-0">
              <label htmlFor="shop-sort" className="whitespace-nowrap text-sm font-semibold text-gray-700">
                Trier par
              </label>
              <select
                id="shop-sort"
                aria-label="Trier les produits"
                value={sortOption}
                onChange={(event) => {
                  const nextSort = event.target.value as CatalogSort;
                  setSortOption(nextSort);
                  navigateWithFilters({ sort: nextSort });
                }}
                className="min-w-44 rounded-full border border-[#d5cec4] bg-white px-4 py-2 text-sm text-[#514942] outline-none focus:ring-2 focus:ring-[#c56f4b]"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
                <option value="popular">Popularité</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f5ef] px-4 py-14">
        <div className="max-w-7xl mx-auto">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.12em] text-[#8b8178]">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-3xl border-[#ded5ca] bg-[#fbf9f5] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative bg-gradient-to-br from-[#f1e9df] to-[#ddd1c3] p-8 text-center">
                  <div className="text-6xl mb-4">{product.image}</div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-4 top-4 rounded-full border border-[#ded5ca] bg-[#fbf9f5] p-2 shadow-sm transition hover:shadow-md"
                    aria-label={`Ajouter ${product.name} aux favoris`}
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="mb-2 line-clamp-2 font-semibold text-[#211e1b] transition hover:text-[#b65f3f]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mb-3 text-sm text-[#6d6259]">{product.category}</p>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="ml-1 text-xs text-[#8b8178]">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-semibold text-[#b65f3f]">€{product.price.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full gap-2 rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={18} />
                    {product.inStock ? "Ajouter au Panier" : "Rupture de Stock"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-[#6d6259]">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
