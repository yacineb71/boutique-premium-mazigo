import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { getSearchParam, matchesCatalogSearch } from "@/lib/catalogSearch";
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

export default function Shop() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const query = typeof window === "undefined" ? location.split("?", 2)[1] ?? "" : window.location.search;
    const category = new URLSearchParams(query).get("category");
    return categories.find((item) => item.toLowerCase() === category?.toLowerCase()) ?? null;
  });
  const [searchTerm, setSearchTerm] = useState(() =>
    getSearchParam(typeof window === "undefined" ? location : window.location.href),
  );
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<number[]>([]);


  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = matchesCatalogSearch(`${product.name} ${product.category}`, searchTerm);
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Shop Header */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Boutique</h1>
          <p className="text-gray-600 text-lg">
            Découvrez notre sélection complète de produits premium
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 mb-6">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center">
                  <div className="text-6xl mb-4">{product.image}</div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:shadow-md transition"
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition">{product.name}</h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-3">{product.category}</p>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-teal-600">€{product.price.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full gap-2"
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
              <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
