import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createSessionMutation = trpc.checkout.createSession.useMutation();

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    setIsLoading(true);
    try {
      const cartItems = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category || "Produit",
      }));

      const result = await createSessionMutation.mutateAsync({
        cartItems,
      });

      if (result.url) {
        (globalThis as Record<string, unknown>).open ? (globalThis as { open: (url: string, target?: string) => void }).open(result.url, "_blank") : window.open(result.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erreur lors de la création de la session de paiement");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Panier Vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits avant de passer à la caisse</p>
            <Button onClick={() => setLocation("/shop")}>Continuer vos achats</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Résumé de Commande</h1>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Articles</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mb-6 bg-teal-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Sous-total:</span>
              <span className="font-semibold">€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Livraison:</span>
              <span className="font-semibold">Gratuite</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-teal-600">€{total.toFixed(2)}</span>
            </div>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Procéder au Paiement"
              )}
            </Button>
            <Button
              onClick={() => setLocation("/cart")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Retour au Panier
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>🔒 Paiement Sécurisé:</strong> Vos données de paiement sont traitées de manière sécurisée par Stripe.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
