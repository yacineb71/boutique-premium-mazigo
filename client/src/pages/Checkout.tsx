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
      const cartItems = items.map((item: any) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, category: item.category || "Produit" }));
      const result = await createSessionMutation.mutateAsync({ cartItems });
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
      <div className="flex min-h-screen flex-col bg-[#f8f5ef] text-[#211e1b]">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="mazigho-eyebrow mb-3">DERNIÈRE ÉTAPE</p>
            <h1 className="mb-4 font-display text-4xl font-semibold text-[#211e1b]">Panier Vide</h1>
            <p className="mb-8 text-[#6d6259]">Ajoutez des produits avant de passer à la caisse.</p>
            <Button onClick={() => setLocation("/shop")} className="rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]">Continuer vos achats</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5ef] text-[#211e1b]">
      <Header />
      <div className="flex-1 bg-[#f8f5ef] px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <p className="mazigho-eyebrow mb-3">DERNIÈRE ÉTAPE</p>
          <h1 className="mb-8 font-display text-4xl font-semibold text-[#211e1b]">Résumé de commande</h1>

          <Card className="mb-6 rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-6">
            <h2 className="mb-4 font-display text-2xl font-semibold text-[#211e1b]">Articles</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b border-[#e3dbd1] pb-4 last:border-0">
                  <div><p className="font-semibold text-[#211e1b]">{item.name}</p><p className="text-sm text-[#6d6259]">Quantité : {item.quantity}</p></div>
                  <p className="font-semibold text-[#211e1b]">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6 rounded-3xl border-[#ded5ca] bg-[#ede7de] p-6">
            <div className="mb-4 flex items-center justify-between"><span className="text-[#6d6259]">Sous-total</span><span className="font-semibold">€{total.toFixed(2)}</span></div>
            <div className="mb-4 flex items-center justify-between"><span className="text-[#6d6259]">Livraison</span><span className="font-semibold">Gratuite</span></div>
            <div className="flex items-center justify-between border-t border-[#d5cec4] pt-4"><span className="text-lg font-semibold">Total</span><span className="text-2xl font-semibold text-[#b65f3f]">€{total.toFixed(2)}</span></div>
          </Card>

          <div className="space-y-4">
            <Button onClick={handleCheckout} disabled={isLoading} className="w-full rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]" size="lg">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Traitement…</> : "Procéder au paiement"}
            </Button>
            <Button onClick={() => setLocation("/cart")} variant="outline" className="w-full rounded-full border-[#d5cec4]" size="lg">Retour au panier</Button>
          </div>

          <div className="mt-8 rounded-2xl border border-[#ded5ca] bg-[#ede7de] p-4"><p className="text-sm text-[#6d6259]"><strong className="text-[#211e1b]">Paiement sécurisé.</strong> Vos données de paiement sont traitées de manière sécurisée par Stripe.</p></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
