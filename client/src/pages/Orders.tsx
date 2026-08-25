import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";

const labels = { awaiting_payment: "Paiement en attente", paid: "Paiement confirmé", to_order: "Commande en préparation", ordered: "Commande traitée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" } as const;

export default function Orders() {
  const sessionId = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("session_id") || "";
  const { data: status } = trpc.checkout.getSessionStatus.useQuery({ sessionId }, { enabled: Boolean(sessionId) });
  const { data: orders = [], isLoading } = trpc.orders.mine.useQuery();

  return <div className="flex min-h-screen flex-col bg-[#f8f5ef] text-[#211e1b]"><Header /><main className="flex-1 px-4 py-14"><div className="mx-auto max-w-5xl"><p className="mazigho-eyebrow mb-3">ESPACE CLIENT</p><h1 className="font-display text-4xl font-semibold">Mes commandes</h1><p className="mt-3 max-w-2xl text-[#6d6259]">Retrouvez vos commandes et leur progression. Les informations fournisseur restent réservées à l’administration.</p>{status?.status === "paid" ? <div className="mt-8 rounded-2xl border border-[#bfe2ce] bg-[#edf8f1] p-4 text-sm text-[#276749]"><strong>Paiement confirmé.</strong> Votre commande est maintenant transmise à notre équipe pour traitement.</div> : null}<div className="mt-8 space-y-4">{isLoading ? <Card className="p-10 text-center text-[#6d6259]">Chargement de vos commandes…</Card> : orders.length === 0 ? <Card className="p-12 text-center"><PackageCheck className="mx-auto mb-4 text-[#8b8178]" size={32} /><h2 className="font-semibold text-[#211e1b]">Aucune commande enregistrée</h2><p className="mt-2 text-sm text-[#6d6259]">Vos commandes apparaîtront ici après un paiement confirmé.</p></Card> : orders.map((order) => <OrderCard key={order.id} order={order} />)}</div></div></main><Footer /></div>;
}

function OrderCard({ order }: { order: { orderNumber: string; status: keyof typeof labels; total: string | number; createdAt: Date } }) {
  const icon = order.status === "delivered" ? CheckCircle2 : order.status === "shipped" ? Truck : order.status === "to_order" || order.status === "ordered" ? PackageCheck : Clock3;
  const Icon = icon;
  return <Card className="rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b8178]">{order.orderNumber}</p><p className="mt-2 text-sm text-[#6d6259]">Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR")}</p></div><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1e9df] text-[#b65f3f]"><Icon size={19} /></span><div><p className="font-semibold text-[#211e1b]">{labels[order.status]}</p><p className="text-sm text-[#6d6259]">Total CHF {Number(order.total).toFixed(2)}</p></div></div></div></Card>;
}
