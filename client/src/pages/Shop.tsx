import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
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
  popularityRank: number;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "T-Shirt Premium Bleu",
    category: "Vêtements",
    price: 29.99,
    image: "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp",
    popularityRank: 12,
    inStock: true,
  },
  {
    id: 2,
    name: "Crème Hydratante Luxe",
    category: "Cosmétiques",
    price: 49.99,
    image: "/manus-storage/mazigho-stock-beaute_c4796701.webp",
    popularityRank: 11,
    inStock: true,
  },
  {
    id: 3,
    name: "Sac à Main Élégant",
    category: "Accessoires",
    price: 89.99,
    image: "/manus-storage/mazigho-stock-accessoires_b78d9731.webp",
    popularityRank: 9,
    inStock: true,
  },
  {
    id: 4,
    name: "Montre Classique",
    category: "Accessoires",
    price: 199.99,
    image: "/manus-storage/mazigho-stock-accessoires_b78d9731.webp",
    popularityRank: 10,
    inStock: true,
  },
  {
    id: 5,
    name: "Parfum Premium",
    category: "Cosmétiques",
    price: 79.99,
    image: "/manus-storage/mazigho-stock-beaute_c4796701.webp",
    popularityRank: 8,
    inStock: true,
  },
  {
    id: 6,
    name: "Ceinture Cuir",
    category: "Accessoires",
    price: 39.99,
    image: "/manus-storage/mazigho-stock-accessoires_b78d9731.webp",
    popularityRank: 7,
    inStock: true,
  },
  {
    id: 7,
    name: "Jeans Slim Fit",
    category: "Vêtements",
    price: 59.99,
    image: "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp",
    popularityRank: 6,
    inStock: true,
  },
  {
    id: 8,
    name: "Robe Soirée",
    category: "Vêtements",
    price: 129.99,
    image: "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp",
    popularityRank: 5,
    inStock: true,
  },
  {
    id: 9,
    name: "Peluche Douce",
    category: "Jouets",
    price: 24.99,
    image: "/manus-storage/mazigho-stock-home_05df7846.webp",
    popularityRank: 4,
    inStock: true,
  },
  {
    id: 10,
    name: "Coffret Cadeau Luxe",
    category: "Cadeaux",
    price: 99.99,
    image: "/manus-storage/mazigho-stock-home_05df7846.webp",
    popularityRank: 3,
    inStock: true,
  },
  {
    id: 11,
    name: "Chaussures Confort",
    category: "Vêtements",
    price: 79.99,
    image: "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp",
    popularityRank: 2,
    inStock: true,
  },
  {
    id: 12,
    name: "Chapeau Élégant",
    category: "Accessoires",
    price: 44.99,
    image: "/manus-storage/mazigho-stock-accessoires_b78d9731.webp",
    popularityRank: 1,
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
              <Card key={product.id} className="group overflow-hidden rounded-3xl border-[#ded5ca] bg-[#fbf9f5] shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-[#c56f4b]/60 hover:shadow-[0_20px_45px_rgba(85,56,43,0.18)] focus-within:-translate-y-2 focus-within:border-[#c56f4b]/60 motion-reduce:transition-none motion-reduce:hover:transform-none">
                <div className="relative aspect-square overflow-hidden bg-[#eee8df] text-center after:absolute after:inset-0 after:bg-[#b65f3f]/10 after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100 group-focus-within:after:opacity-100">
                  <img src={product.image} alt={`${product.name} — ${product.category}`} width="640" height="640" loading="lazy" decoding="async" className="relative z-10 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:scale-105 motion-reduce:transform-none" onLoad={(event) => event.currentTarget.classList.remove("opacity-0")} onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <Link href={`/product/${product.id}`} className="absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1 rounded-full bg-[#211e1b]/90 px-4 py-2 text-xs font-semibold text-[#f8f5ef] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c56f4b] motion-reduce:translate-y-0 motion-reduce:transition-none" aria-label={`Voir ${product.name}`}>
                    Voir le produit <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-4 top-4 z-30 rounded-full border border-[#ded5ca] bg-[#fbf9f5] p-2 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c56f4b]"
                    aria-label={`Ajouter ${product.name} aux favoris`}
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.id}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c56f4b] focus-visible:ring-offset-2">
                    <h3 className="mb-2 line-clamp-2 font-semibold text-[#211e1b] transition hover:text-[#b65f3f]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mb-3 text-sm text-[#6d6259]">{product.category}</p>

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
