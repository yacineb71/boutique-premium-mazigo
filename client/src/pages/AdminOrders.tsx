import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, ExternalLink, Loader2, PackageCheck, Search, Truck } from "lucide-react";

const statusLabels = {
  awaiting_payment: "Paiement en attente",
  paid: "Payée",
  to_order: "À commander",
  ordered: "Commandée fournisseur",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
} as const;

const statuses = Object.keys(statusLabels) as Array<keyof typeof statusLabels>;

export default function AdminOrders() {
  const { data: orders = [], isLoading } = trpc.orders.adminList.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [tracking, setTracking] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [supplierRef, setSupplierRef] = useState("");
  const [note, setNote] = useState("");
  const utils = trpc.useUtils();
  const updateMutation = trpc.orders.updateFulfillment.useMutation({ onSuccess: () => utils.orders.adminList.invalidate() });
  const { data: selectedItems = [] } = trpc.orders.adminItems.useQuery({ orderId: selectedId ?? 0 }, { enabled: selectedId !== null });
  const itemUpdateMutation = trpc.orders.updateItemSupplier.useMutation({ onSuccess: () => selectedId !== null && utils.orders.adminItems.invalidate({ orderId: selectedId }) });
  const [supplierUrls, setSupplierUrls] = useState<Record<number, string>>({});
  const [supplierCosts, setSupplierCosts] = useState<Record<number, string>>({});
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;
  useEffect(() => {
    setSupplierUrls(Object.fromEntries(selectedItems.map((item) => [item.id, item.supplierUrl ?? ""])));
    setSupplierCosts(Object.fromEntries(selectedItems.map((item) => [item.id, item.supplierCost ?? ""])));
  }, [selectedItems]);
  const filteredOrders = orders.filter((order) => `${order.orderNumber} ${order.customerName ?? ""} ${order.customerEmail ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  const selectOrder = (order: (typeof orders)[number]) => {
    setSelectedId(order.id);
    setTracking(order.trackingNumber ?? "");
    setTrackingUrl(order.trackingUrl ?? "");
    setSupplierRef(order.supplierOrderRef ?? "");
    setNote(order.internalNote ?? "");
  };

  const save = (status?: keyof typeof statusLabels) => {
    if (!selectedOrder) return;
    updateMutation.mutate({ orderId: selectedOrder.id, status, trackingNumber: tracking || null, trackingUrl: trackingUrl || null, supplierOrderRef: supplierRef || null, internalNote: note || null });
  };

  return <AdminLayout><div className="space-y-6">
    <section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] to-[#f4e9df] p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">Préparation</p><div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-[#211e1b]">Commandes</h2><p className="mt-3 max-w-2xl text-[#6d6259]">Après paiement, retrouvez ici les commandes à traiter manuellement auprès du fournisseur.</p></div><div className="rounded-2xl bg-[#fffdf9] px-4 py-3 text-sm text-[#6d6259]"><span className="font-semibold text-[#211e1b]">{orders.length}</span> commande(s) enregistrée(s)</div></div></section>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]"><div className="border-b border-[#eee5dc] p-5 sm:p-6"><label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={17} /><span className="sr-only">Rechercher une commande</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une commande ou un client…" className="h-11 w-full rounded-full border border-[#d5cec4] bg-[#fffdf9] pl-10 pr-4 text-sm text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label></div>{isLoading ? <div className="flex items-center justify-center p-16 text-[#8b8178]"><Loader2 className="mr-2 animate-spin" size={20} />Chargement des commandes…</div> : filteredOrders.length === 0 ? <div className="p-16 text-center"><PackageCheck className="mx-auto mb-3 text-[#8b8178]" size={30} /><p className="font-semibold text-[#211e1b]">Aucune commande à afficher</p><p className="mt-1 text-sm text-[#6d6259]">Les commandes payées apparaîtront ici pour traitement manuel.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px]"><thead className="border-b border-[#eee5dc] bg-[#f8f5ef]"><tr>{["Commande", "Client", "Montant", "Statut", "Action"].map((heading) => <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8178]">{heading}</th>)}</tr></thead><tbody>{filteredOrders.map((order) => <tr key={order.id} className={`border-b border-[#eee5dc] transition hover:bg-[#fbf5eb] ${selectedId === order.id ? "bg-[#fbf5eb]" : ""}`}><td className="px-4 py-4 text-sm font-semibold text-[#211e1b]">{order.orderNumber}<span className="mt-1 block text-xs font-normal text-[#8b8178]">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span></td><td className="px-4 py-4 text-sm text-[#514942]">{order.customerName || "Client"}<span className="mt-1 block text-xs text-[#8b8178]">{order.customerEmail || "Email non disponible"}</span></td><td className="px-4 py-4 text-sm font-semibold text-[#211e1b]">€{Number(order.total).toFixed(2)}</td><td className="px-4 py-4"><span className="rounded-full bg-[#f1e9df] px-3 py-1 text-xs font-semibold text-[#8b5a45]">{statusLabels[order.status]}</span></td><td className="px-4 py-4"><button type="button" onClick={() => selectOrder(order)} className="rounded-full border border-[#d5cec4] px-3 py-2 text-xs font-semibold text-[#514942] hover:border-[#b65f3f] hover:text-[#b65f3f]">Gérer</button></td></tr>)}</tbody></table></div>}</Card>
      <Card className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-5 sm:p-6">{selectedOrder ? <div className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b65f3f]">Traitement manuel</p><h3 className="mt-2 text-2xl font-semibold text-[#211e1b]">{selectedOrder.orderNumber}</h3><p className="mt-1 text-sm text-[#6d6259]">Les informations ci-dessous sont internes à l’administration.</p></div><div className="space-y-3 rounded-2xl bg-[#f8f5ef] p-4"><p className="text-sm font-semibold text-[#211e1b]">Articles à commander</p>{selectedItems.length === 0 ? <p className="text-sm text-[#6d6259]">Les lignes apparaîtront après confirmation du paiement.</p> : selectedItems.map((item) => <div key={item.id} className="rounded-xl border border-[#eadfd4] bg-[#fffdf9] p-3"><p className="truncate text-sm font-semibold text-[#514942]">{item.name} × {item.quantity}</p><input value={supplierUrls[item.id] ?? ""} onChange={(event) => setSupplierUrls((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="URL AliExpress du produit" className="mt-2 h-9 w-full rounded-lg border border-[#d5cec4] bg-[#fffdf9] px-3 text-xs text-[#211e1b] outline-none focus:border-[#b65f3f]" /><div className="mt-2 flex gap-2"><input value={supplierCosts[item.id] ?? ""} onChange={(event) => setSupplierCosts((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Coût fournisseur" inputMode="decimal" className="h-9 min-w-0 flex-1 rounded-lg border border-[#d5cec4] bg-[#fffdf9] px-3 text-xs text-[#211e1b] outline-none focus:border-[#b65f3f]" /><button type="button" onClick={() => itemUpdateMutation.mutate({ itemId: item.id, supplierUrl: supplierUrls[item.id] || null, supplierCost: supplierCosts[item.id] || null })} className="rounded-lg border border-[#d5cec4] px-3 text-xs font-semibold text-[#b65f3f] hover:border-[#b65f3f]">Enregistrer</button></div></div>)}</div><label className="block text-sm font-semibold text-[#514942]">Référence commande fournisseur<input value={supplierRef} onChange={(event) => setSupplierRef(event.target.value)} placeholder="À renseigner après commande" className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><label className="block text-sm font-semibold text-[#514942]">Numéro de suivi<input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="À renseigner à l’expédition" className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><label className="block text-sm font-semibold text-[#514942]">Lien de suivi<input value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} placeholder="https://transporteur.example/suivi" className="mt-2 h-10 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><label className="block text-sm font-semibold text-[#514942]">Note interne<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Fournisseur, contrôle, retour…" className="mt-2 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] p-3 text-sm font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label><div><p className="mb-2 text-sm font-semibold text-[#514942]">Avancer le statut</p><div className="grid grid-cols-2 gap-2">{statuses.filter((status) => status !== "awaiting_payment" && status !== "paid" && status !== "cancelled").map((status) => <button key={status} type="button" disabled={updateMutation.isPending} onClick={() => save(status)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d5cec4] px-3 text-xs font-semibold text-[#514942] hover:border-[#b65f3f] hover:text-[#b65f3f] disabled:opacity-60"><Check size={14} />{statusLabels[status]}</button>)}</div></div>{selectedOrder.trackingNumber ? <a href={selectedOrder.trackingUrl ?? "#"} className="inline-flex items-center gap-2 text-sm font-semibold text-[#b65f3f]">Suivi transporteur <ExternalLink size={14} /></a> : null}<button type="button" onClick={() => save()} disabled={updateMutation.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#211e1b] text-sm font-semibold text-white hover:bg-[#3a332f] disabled:opacity-60">{updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Truck size={16} />}Enregistrer les informations</button></div> : <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><PackageCheck className="mb-4 text-[#8b8178]" size={32} /><h3 className="font-semibold text-[#211e1b]">Sélectionnez une commande</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#6d6259]">Vous pourrez ensuite renseigner la commande fournisseur, le suivi et le statut d’expédition.</p></div>}</Card>
    </div>
  </div></AdminLayout>;
}
