import { Card } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  ClipboardList,
  Package,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

const categoryPalette = ["#b65f3f", "#d9a078", "#8b5a45", "#c58b68", "#5b4035"];

export default function AdminDashboard() {
  const { data: products = [], isLoading, refetch } = trpc.products.getAll.useQuery();
  const categoryCounts = products.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
  const categories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
  const lowStockProducts = products.filter((product) => product.inStock === false);

  const stats = [
    { label: "Ventes encaissées", value: "—", detail: "Aucune source de commandes réglées", icon: WalletCards, tone: "bg-[#f1e9df] text-[#b65f3f]" },
    { label: "Commandes à traiter", value: "—", detail: "Source de commandes non chargée", icon: ShoppingCart, tone: "bg-[#f6edc9] text-[#8b5a45]" },
    { label: "Produits actifs", value: isLoading ? "—" : products.length.toString(), detail: "Catalogue actuellement chargé", icon: Package, tone: "bg-[#f1e0d5] text-[#b65f3f]" },
    { label: "Clients inscrits", value: "—", detail: "Source clients non chargée", icon: Users, tone: "bg-[#e8e0f1] text-[#7454a8]" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] via-[#fbf5eb] to-[#f4e9df] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#b65f3f]"><span className="h-2 w-2 rounded-full bg-[#41a46d]" /> Boutique opérationnelle</div>
            <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#211e1b] sm:text-5xl">Tableau de bord<br />MAZIGHO</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d6259]">Vos indicateurs essentiels, vos alertes et vos prochaines actions réunis au même endroit.</p>
          </div>
          <button type="button" onClick={() => void refetch()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d5cec4] bg-[#fffdf9] px-5 text-sm font-semibold text-[#8b5a45] transition hover:border-[#b65f3f] hover:text-[#b65f3f]">
            <RefreshCw size={16} aria-hidden="true" /> Actualiser
          </button>
        </div>
      </section>

      <section aria-label="Indicateurs clés" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b8178]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#211e1b]">{stat.value}</p>
                  <p className="mt-2 text-xs leading-5 text-[#6d6259]">{stat.detail}</p>
                </div>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.tone}`}><Icon size={21} aria-hidden="true" /></span>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]">
          <div className="border-b border-[#eee5dc] p-5 sm:p-6">
            <div className="flex items-center gap-3"><BarChart3 className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Répartition du catalogue</h3><p className="mt-1 text-sm text-[#6d6259]">Produits actuellement enregistrés, regroupés par catégorie.</p></div></div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            {categories.length === 0 ? (
              <div className="rounded-2xl bg-[#f8f5ef] px-5 py-12 text-center"><Package className="mx-auto mb-3 text-[#b65f3f]" size={28} /><p className="font-semibold text-[#211e1b]">Aucun produit enregistré</p><p className="mt-1 text-sm text-[#6d6259]">La répartition apparaîtra dès qu’un produit sera ajouté.</p></div>
            ) : (
              categories.map(([category, count], index) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="font-semibold text-[#514942]">{category}</span><span className="font-semibold text-[#211e1b]">{count}</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#eee8df]"><div className="h-full rounded-full" style={{ width: `${Math.max(12, (count / products.length) * 100)}%`, backgroundColor: categoryPalette[index % categoryPalette.length] }} /></div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3"><AlertCircle className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Lecture fiable</h3><p className="mt-1 text-sm text-[#6d6259]">Des indicateurs utiles, sans chiffres décoratifs.</p></div></div>
          <div className="space-y-4 rounded-2xl bg-[#f8f5ef] p-5 text-sm leading-6 text-[#6d6259]">
            <p><strong className="text-[#211e1b]">Source des montants.</strong><br />Seules les commandes marquées réglées alimentent les ventes ; les achats et frais viennent du suivi administratif.</p>
            <p><strong className="text-[#211e1b]">Mise à jour.</strong><br />Utilisez « Actualiser » après une action pour relire les données enregistrées.</p>
          </div>
        </Card>
      </section>

      <section className="rounded-[1.25rem] border border-[#eadfd4] bg-[#fff8ef] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><ClipboardList className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Centre de préparation</h3><p className="mt-1 text-sm text-[#6d6259]">Contrôles en lecture seule avant toute mise en avant du catalogue.</p></div></div><span className="text-sm font-semibold text-[#8b5a45]">Aucune publication automatique</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[{ label: "Profils de livraison", detail: "Vérifier les destinations", href: "/admin/settings", icon: TruckIcon }, { label: "Traductions catalogue", detail: "Voir les fiches à compléter", href: "/admin/settings", icon: LanguagesIcon }, { label: "Stock à surveiller", detail: "Consulter les quantités", href: "/admin/products", icon: Package }].map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className="group rounded-2xl border border-[#f0dfc8] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#d9a078]"><Icon className="mb-4 text-[#b65f3f]" size={20} /><p className="font-semibold text-[#211e1b]">{item.label}</p><p className="mt-1 text-xs text-[#6d6259]">{item.detail}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#b65f3f]">Ouvrir le contrôle <ArrowUpRight size={13} /></span></Link>; })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]">
          <div className="border-b border-[#eee5dc] p-5 sm:p-6"><div className="flex items-center gap-3"><AlertCircle className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Alertes de stock</h3><p className="mt-1 text-sm text-[#6d6259]">Produits dont la quantité disponible nécessite une vérification.</p></div></div></div>
          {lowStockProducts.length === 0 ? <div className="px-5 py-12 text-center sm:px-6"><Package className="mx-auto mb-3 text-[#41a46d]" size={28} /><p className="font-semibold text-[#211e1b]">Aucune alerte de stock</p><p className="mt-1 text-sm leading-6 text-[#6d6259]">Aucun produit marqué comme indisponible dans le catalogue chargé.</p></div> : <div className="divide-y divide-[#eee5dc]">{lowStockProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-4 p-4"><span className="truncate text-sm font-semibold text-[#514942]">{product.name}</span><span className="shrink-0 rounded-full bg-[#f6edc9] px-3 py-1 text-xs font-semibold text-[#8b5a45]">Indisponible</span></div>)}</div>}
        </Card>
        <Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]">
          <div className="border-b border-[#eee5dc] p-5 sm:p-6"><div className="flex items-center gap-3"><ClipboardList className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Activité récente</h3><p className="mt-1 text-sm text-[#6d6259]">Les dernières actions administratives enregistrées.</p></div></div></div>
          <div className="px-5 py-12 text-center sm:px-6"><ClipboardList className="mx-auto mb-3 text-[#8b8178]" size={28} /><p className="font-semibold text-[#211e1b]">Aucune activité enregistrée</p><p className="mt-1 text-sm leading-6 text-[#6d6259]">Les actions apparaîtront ici dès qu’un événement sera enregistré.</p></div>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[{ label: "Ajouter un produit", href: "/admin/products", icon: Package }, { label: "Traiter les commandes", href: "/admin/orders", icon: ShoppingCart }, { label: "Éditer le contenu", href: "/admin/content", icon: Sparkles }].map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-2xl border border-[#eadfd4] bg-[#fffdf9] p-4 transition hover:border-[#d9a078]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1e9df] text-[#b65f3f]"><Icon size={18} /></span><span className="text-sm font-semibold text-[#514942]">{item.label}</span><ArrowUpRight className="ml-auto text-[#8b8178]" size={16} /></Link>; })}
      </section>
      </div>
    </AdminLayout>
  );
}

function TruckIcon(props: { size?: number; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={props.size ?? 20} height={props.size ?? 20} className={props.className} aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>;
}

function LanguagesIcon(props: { size?: number; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={props.size ?? 20} height={props.size ?? 20} className={props.className} aria-hidden="true"><path d="M4 5h8M8 3v2m0 0c0 4-2 7-5 9m5-9c0 3 2 6 5 8M5 20l4-9 4 9m-6-3h4M15 5h5l-3 4 3 4h-5" /></svg>;
}
