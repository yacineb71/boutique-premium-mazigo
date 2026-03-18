import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductReview, type Review } from "@/components/ProductReview";
import { useCart } from "@/hooks/useCart";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";

// Mock product data
const PRODUCTS: Record<string, any> = {
  "1": {
    id: 1,
    name: "T-Shirt Premium Bleu",
    category: "Vêtements",
    price: 29.99,
    image: "👕",
    rating: 4.5,
    reviews: 128,
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
    image: "💄",
    rating: 4.8,
    reviews: 256,
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

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Marie Dupont",
    rating: 5,
    title: "Excellent produit !",
    comment: "Très satisfait de mon achat. La qualité est excellente et la livraison rapide.",
    date: "15 mars 2026",
    verified: true,
  },
  {
    id: 2,
    author: "Jean Martin",
    rating: 4,
    title: "Bon rapport qualité-prix",
    comment: "Produit de bonne qualité. Je recommande vivement.",
    date: "10 mars 2026",
    verified: true,
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = id ? PRODUCTS[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
              <div className="text-9xl">{product.image}</div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              <div className="text-4xl font-bold text-teal-600 mb-6">€{product.price.toFixed(2)}</div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Caractéristiques:</h3>
                <ul className="space-y-2">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index} className="text-gray-600 flex items-center">
                      <span className="text-teal-600 mr-2">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-teal-600 hover:bg-teal-700 mb-4"
                size="lg"
              >
                <ShoppingCart className="mr-2" size={20} />
                Ajouter au Panier
              </Button>

              <Button onClick={() => setLocation("/shop")} variant="outline" className="w-full">
                Continuer vos Achats
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReview
            productId={product.id}
            reviews={SAMPLE_REVIEWS}
            averageRating={product.rating}
            totalReviews={product.reviews}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
