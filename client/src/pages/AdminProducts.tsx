import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { calculateIndicativeMargin, isAliExpressProductUrl, isValidSupplierCost } from "@/lib/supplierValidation";
import { ExternalLink, Loader2, Package, Search, Save } from "lucide-react";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [supplierUrl, setSupplierUrl] = useState("");
  const [supplierSku, setSupplierSku] = useState("");
  const [supplierCost, setSupplierCost] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { data: products = [], isLoading } = trpc.products.getAll.useQuery();
  const selectedProduct = products.find((product) => product.id === selectedId) ?? null;
  const { data: meta } = trpc.products.adminSupplierMeta.useQuery({ productId: selectedId ?? 0 }, { enabled: selectedId !== null });
  const saveMutation = trpc.products.upsertSupplierMeta.useMutation({
    onSuccess: () => setFeedback({ type: "success", message: "Informations fournisseur enregistrées." }),
    onError: (error) => setFeedback({ type: "error", message: error.message || "Impossible d’enregistrer ces informations." }),
  });

  useEffect(() => {
    setSupplierUrl(meta?.supplierUrl ?? "");
    setSupplierSku(meta?.supplierSku ?? "");
    setSupplierCost(meta?.supplierCost ?? "");
    setNotes(meta?.notes ?? "");
  }, [meta]);

  const filteredProducts = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectProduct = (id: number) => { setSelectedId(id); setFeedback(null); };
  const save = () => {
    if (selectedId === null) return;
    if (supplierUrl && !isAliExpressProductUrl(supplierUrl)) {
      setFeedback({ type: "error", message: "Utilisez une URL produit AliExpress valide." });
      return;
    }
    if (supplierCost && !isValidSupplierCost(supplierCost)) {
      setFeedback({ type: "error", message: "Le coût doit être un montant positif, par exemple 12.50." });
      return;
    }
    setFeedback(null);
    saveMutation.mutate({ productId: selectedId, supplierUrl: supplierUrl || null, supplierSku: supplierSku || null, supplierCost: supplierCost || null, notes: notes || null });
  };
  const supplierCostValue = supplierCost ? Number(supplierCost) : NaN;
  const margin = selectedProduct ? calculateIndicativeMargin(selectedProduct.price, supplierCostValue) : null;

  return <AdminLayout><div className="space-y-6"><section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] to-[#f4e9df] p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">Catalogue</p><h1 className="mt-3 font-display text-4xl font-semibold text-[#211e1b]">Produits & fournisseurs</h1><p className="mt-3 max-w-2xl text-[#6d6259]">Préparez chaque fiche produit et conservez les informations AliExpress uniquement dans l’espace administrateur.</p></section><div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]"><div className="border-b border-[#eee5dc] p-5"><label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={17} /><span className="sr-only">Rechercher un produit</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher un produit…" className="h-11 w-full rounded-full border border-[#d5cec4] bg-[#fffdf9] pl-10 pr-4 text-sm text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label></div>{isLoading ? <div className="p-12 text-center text-[#6d6259]"><Loader2 className="mx-auto mb-2 animate-spin" size={20} />Chargement du catalogue…</div> : <div className="overflow-x-auto"><table className="w-full min-w-[620px]"><thead className="bg-[#f8f5ef]"><tr>{["Produit", "Catégorie", "Prix", "Stock", "Fiche fournisseur"].map((heading) => <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8178]">{heading}</th>)}</tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.id} className={`border-t border-[#eee5dc] ${selectedId === product.id ? "bg-[#fbf5eb]" : ""}`}><td className="px-4 py-4 text-sm font-semibold text-[#211e1b]">{product.name}</td><td className="px-4 py-4 text-sm text-[#6d6259]">{product.category}</td><td className="px-4 py-4 text-sm font-semibold text-[#211e1b]">€{product.price.toFixed(2)}</td><td className="px-4 py-4 text-sm text-[#6d6259]">{product.inStock ? "Disponible" : "Rupture"}</td><td className="px-4 py-4"><button type="button" onClick={() => selectProduct(product.id)} className="rounded-full border border-[#d5cec4] px-3 py-2 text-xs font-semibold text-[#b65f3f] hover:border-[#b65f3f]">Configurer</button></td></tr>)}</tbody></table></div>}</Card><Card className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-5 sm:p-6">{selectedProduct ? <div className="space-y-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b65f3f]">Fiche interne</p><h2 className="mt-2 text-2xl font-semibold text-[#211e1b]">{selectedProduct.name}</h2><p className="mt-1 text-sm text-[#6d6259]">Ces données ne sont jamais envoyées au client.</p></div>{feedback ? <div role="status" className={`rounded-xl border px-3 py-2 text-sm ${feedback.type === "success" ? "border-[#bfe2ce] bg-[#edf8f1] text-[#276749]" : "border-[#efc1b5] bg-[#fff1ed] text-[#9b3d27]"}`}>{feedback.message}</div> : null}<label className="block text-sm font-semibold text-[#514942]">URL AliExpress<input type="url" value={supplierUrl} onChange={(event) => setSupplierUrl(event.target.value)} placeholder="https://www.aliexpress.com/item/..." className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><label className="block text-sm font-semibold text-[#514942]">SKU fournisseur<input value={supplierSku} onChange={(event) => setSupplierSku(event.target.value)} placeholder="Référence facultative" className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><label className="block text-sm font-semibold text-[#514942]">Coût fournisseur<input value={supplierCost} onChange={(event) => { setSupplierCost(event.target.value.replace(",", ".")); setFeedback(null); }} placeholder="Ex. 12.50" inputMode="decimal" aria-describedby="margin-preview" className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label>{margin ? <div id="margin-preview" className={`rounded-xl border p-3 text-sm ${margin.amount >= 0 ? "border-[#bfe2ce] bg-[#edf8f1] text-[#276749]" : "border-[#efc1b5] bg-[#fff1ed] text-[#9b3d27]"}`}><div className="flex items-center justify-between"><span>Marge indicative</span><strong>€{margin.amount.toFixed(2)} · {margin.percent.toFixed(1)}%</strong></div><p className="mt-1 text-xs opacity-80">Calcul interne basé sur le prix catalogue, hors livraison, taxes et frais de paiement.</p></div> : null}<label className="block text-sm font-semibold text-[#514942]">Notes internes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Délais, variantes, consignes…" className="mt-2 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] p-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><div className="flex gap-2"><Button type="button" onClick={save} disabled={saveMutation.isPending} className="flex-1 rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]"><Save className="mr-2" size={16} />{saveMutation.isPending ? "Enregistrement…" : "Enregistrer"}</Button>{supplierUrl ? <a href={supplierUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-[#d5cec4] px-4 text-[#b65f3f]" aria-label="Ouvrir le fournisseur"><ExternalLink size={16} /></a> : null}</div></div> : <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><Package className="mb-4 text-[#8b8178]" size={32} /><h2 className="font-semibold text-[#211e1b]">Sélectionnez un produit</h2><p className="mt-2 max-w-xs text-sm leading-6 text-[#6d6259]">Ajoutez ensuite le lien fournisseur et le coût d’achat pour faciliter vos commandes manuelles.</p></div>}</Card></div></div></AdminLayout>;
}
