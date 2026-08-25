import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8f5ef] text-[#211e1b]">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-[#d5cec4]" />
            <p className="mazigho-eyebrow mb-3">VOTRE SÉLECTION</p>
            <h1 className="mb-4 font-display text-4xl font-semibold text-[#211e1b]">Votre panier est vide</h1>
            <p className="mb-8 text-[#6d6259]">Découvrez nos produits et commencez vos achats.</p>
            <Link href="/shop" className="inline-flex rounded-full bg-[#211e1b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3a332f]">Continuer les achats</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5ef] text-[#211e1b]">
      <Header />
      <section className="bg-[#ede7de] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="mazigho-eyebrow mb-3">VOTRE SÉLECTION</p>
          <h1 className="font-display text-5xl font-semibold text-[#211e1b]">Mon Panier</h1>
        </div>
      </section>

      <section className="flex-1 bg-[#f8f5ef] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-[#e3dbd1] pb-4 last:border-0">
                      <img src={item.image} alt={item.name} width="96" height="96" loading="lazy" decoding="async" className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#211e1b]">{item.name}</h3>
                        <p className="font-semibold text-[#b65f3f]">CHF {item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full p-2 text-[#6d6259] hover:bg-[#eee8df]" aria-label={`Diminuer la quantité de ${item.name}`}><Minus size={18} /></button>
                        <input type="number" value={item.quantity} onChange={(event) => updateQuantity(item.id, parseInt(event.target.value) || 1)} className="w-12 rounded border border-[#d5cec4] bg-white py-1 text-center" min="1" aria-label={`Quantité de ${item.name}`} />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full p-2 text-[#6d6259] hover:bg-[#eee8df]" aria-label={`Augmenter la quantité de ${item.name}`}><Plus size={18} /></button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[#211e1b]">CHF {(item.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="mt-2 text-[#b65f3f] hover:text-[#8e422d]" aria-label={`Supprimer ${item.name}`}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#e3dbd1] pt-6">
                  <Button variant="outline" className="w-full rounded-full border-[#d5cec4]" onClick={clearCart}>Vider le panier</Button>
                </div>
              </Card>
            </div>

            <div>
              <Card className="sticky top-32 rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-6">
                <h2 className="mb-6 font-display text-2xl font-semibold text-[#211e1b]">Résumé de la commande</h2>
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between"><span className="text-[#6d6259]">Sous-total</span><span className="font-semibold">CHF {total.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[#6d6259]">Livraison</span><span className="font-semibold">{total >= 50 ? "Gratuite" : "CHF 9.99"}</span></div>
                  <div className="flex justify-between"><span className="text-[#6d6259]">TVA (20%)</span><span className="font-semibold">CHF {(total * 0.2).toFixed(2)}</span></div>
                </div>
                <div className="mb-6 border-t border-[#e3dbd1] pt-6"><div className="flex items-center justify-between"><span className="text-lg font-semibold">Total</span><span className="text-2xl font-semibold text-[#b65f3f]">CHF {(total * 1.2 + (total >= 50 ? 0 : 9.99)).toFixed(2)}</span></div></div>
                <Link href="/checkout" className="mb-3 flex w-full justify-center rounded-full bg-[#211e1b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#3a332f]">Procéder au paiement</Link>
                <Link href="/shop" className="flex w-full justify-center rounded-full border border-[#d5cec4] px-4 py-3 text-sm font-semibold text-[#514942] hover:bg-[#eee8df]">Continuer les achats</Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
