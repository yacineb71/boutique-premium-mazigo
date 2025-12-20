import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilter from "@/components/ProductFilter";
import { getAllProducts, getAllCategories } from "@/data/mockData";
import { useCart } from "@/hooks/useCart";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useLocation } from "wouter";

export default function AllProducts() {
  const [, navigate] = useLocation();
  const categories = getAllCategories();
  const allProducts = getAllProducts();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const {
    filteredProducts,
    filters,
    setSearchQuery,
    setCategoryId,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    resetFilters,
    getMaxPrice,
    getMinPrice,
  } = useProductFilter(allProducts);

  const handleAddToCart = (productId: number) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      addToCart(productId, product.name, product.price, 1);
      setAddedToCart(productId);
      setTimeout(() => setAddedToCart(null), 2000);
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour à l'accueil</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tous les Produits
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez notre sélection complète de produits. Utilisez les filtres pour trouver exactement ce que vous cherchez.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filter */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <ProductFilter
                    categories={categories}
                    filters={filters}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setCategoryId}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                    onSortChange={setSortBy}
                    onReset={resetFilters}
                    maxPrice={getMaxPrice()}
                    minPrice={getMinPrice()}
                    resultCount={filteredProducts.length}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-0">
                          {/* Product Image */}
                          <div className="relative bg-muted h-48 flex items-center justify-center overflow-hidden group">
                            <div className="text-6xl group-hover:scale-110 transition-transform">
                              📦
                            </div>
                            {product.originalPrice && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                -
                                {Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                    100
                                )}
                                %
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4 space-y-3">
                            <button
                              onClick={() => navigate(`/produit/${product.slug}`)}
                              className="text-left w-full"
                            >
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                            </button>

                            {/* Rating */}
                            {product.averageRating > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.round(product.averageRating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ({product.reviews.length})
                                </span>
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-foreground">
                                {(product.price / 100).toFixed(2)}€
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {(product.originalPrice / 100).toFixed(2)}€
                                </span>
                              )}
                            </div>

                            {/* Stock Status */}
                            <p
                              className={`text-sm font-medium ${
                                product.stock > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {product.stock > 0
                                ? `${product.stock} en stock`
                                : "Rupture de stock"}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                className="flex-1 gap-2"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={product.stock === 0}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                {addedToCart === product.id
                                  ? "Ajouté !"
                                  : "Ajouter"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleFavorite(product.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    favorites.has(product.id)
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">
                      Aucun produit ne correspond à vos critères de recherche.
                    </p>
                    <Button onClick={resetFilters} variant="outline">
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
