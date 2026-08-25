import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductReview } from "@/components/ProductReview";
import { useCart } from "@/hooks/useCart";
import { useParams, useLocation } from "wouter";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { trpc } from "@/lib/trpc";

// Mock product data
const PRODUCTS: Record<string, any> = {
  "1": {
    id: 1,
    name: "T-Shirt Premium Bleu",
    category: "Vêtements",
    price: 29.99,
    image: "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp",
    images: ["/manus-storage/mazigho-stock-mode_ab0ed7cb.webp", "/manus-storage/mazigho-stock-home_05df7846.webp", "/manus-storage/mazigho-stock-accessoires_b78d9731.webp"],
    description:
      "T-shirt premium en coton 100% biologique. Confortable, durable et écologique.",
    details: [
      "100% coton biologique",
      "Lavable en machine à 30°C",
      "Tailles XS à XXL",
      "Disponible en plusieurs couleurs",
    ],
  },
  "2": {
    id: 2,
    name: "Crème Hydratante Luxe",
    category: "Cosmétiques",
    price: 49.99,
    image: "/manus-storage/mazigho-stock-beaute_c4796701.webp",
    images: ["/manus-storage/mazigho-stock-beaute_c4796701.webp", "/manus-storage/mazigho-stock-home_05df7846.webp", "/manus-storage/mazigho-stock-accessoires_b78d9731.webp"],
    description:
      "Crème hydratante luxe pour tous les types de peau. Formule naturelle et efficace.",
    details: [
      "Formule naturelle",
      "Sans parabènes",
      "Testé dermatologiquement",
      "Contenance: 50ml",
    ],
  },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const productQuery = trpc.content?.products?.byId?.useQuery?.(id ? { id: Number(id) } : { id: 0 }, { enabled: Boolean(id) });
  const mediaQuery = trpc.content?.media?.publicByProduct?.useQuery?.(id ? { productId: Number(id) } : { productId: 0 }, { enabled: Boolean(id) });
  const persistedProduct = productQuery?.data;
  const categoryLabels = ["", "Vêtements", "Cosmétiques", "Accessoires", "Cadeaux", "Jouets"];
  const product = persistedProduct ? { id: persistedProduct.id, name: persistedProduct.name, category: categoryLabels[persistedProduct.categoryId] ?? "Autres", price: persistedProduct.price / 100, image: mediaQuery?.data?.[0]?.media.url ?? "/manus-storage/mazigho-stock-mode_ab0ed7cb.webp", images: mediaQuery?.data?.map((media) => media.media.url) ?? [], description: persistedProduct.description ?? "Une trouvaille pensée pour accompagner votre quotidien.", details: ["Sélection MAZIGHO", persistedProduct.stock > 0 ? "Disponible" : "Actuellement indisponible"] } : (id ? PRODUCTS[id] : null);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f5ef] text-[#211e1b]">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit Non Trouvé</h1>
            <Button onClick={() => setLocation("/shop")}>Retour à la Boutique</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ef] text-[#211e1b]">
      <Header />

      <div className="flex-1 bg-[#f8f5ef] px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Product Image */}
            <ProductImageCarousel images={product.images ?? [product.image]} alt={`${product.name} — ${product.category}`} />

            {/* Product Info */}
            <div>
              <h1 className="mb-4 font-display text-4xl font-semibold text-[#211e1b]">{product.name}</h1>

              <div className="mb-6 text-4xl font-semibold text-[#b65f3f]">€{product.price.toFixed(2)}</div>

              <p className="mb-6 leading-7 text-[#6d6259]">{product.description}</p>

              <div className="mb-6">
                <h3 className="mb-3 font-display text-xl font-semibold text-[#211e1b]">Caractéristiques:</h3>
                <ul className="space-y-2">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-center text-[#6d6259]">
                      <span className="mr-2 text-[#b65f3f]">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center rounded-full border border-[#d5cec4] bg-[#fbf9f5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-[#6d6259] hover:bg-[#eee8df]"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-[#211e1b]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-[#6d6259] hover:bg-[#eee8df]"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="mb-4 w-full rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]"
                size="lg"
              >
                <ShoppingCart className="mr-2" size={20} />
                Ajouter au Panier
              </Button>

              <Button onClick={() => setLocation("/shop")} variant="outline" className="w-full rounded-full border-[#d5cec4]">
                Continuer vos Achats
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReview productId={product.id} reviews={[]} averageRating={0} totalReviews={0} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
