import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  FileText,
  FolderOpen,
  Languages,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
}

type AdminMenuItem = {
  icon: typeof BarChart3;
  label: string;
  href: string;
};

const menuSections: Array<{ label: string; items: AdminMenuItem[] }> = [
  {
    label: "Pilotage",
    items: [
      { icon: BarChart3, label: "Tableau de bord", href: "/admin" },
      { icon: ClipboardList, label: "Suivi administratif", href: "/admin/orders" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { icon: Package, label: "Produits", href: "/admin/products" },
      { icon: FolderOpen, label: "Catégories", href: "/admin/categories" },
      { icon: Palette, label: "Collections créatives", href: "/admin/categories" },
      { icon: Languages, label: "Langues & traductions", href: "/admin/settings" },
    ],
  },
  {
    label: "Préparation",
    items: [
      { icon: Truck, label: "Importer fournisseur", href: "/admin/products" },
      { icon: Truck, label: "Hub fournisseurs", href: "/admin/products" },
      { icon: ShoppingCart, label: "Commandes", href: "/admin/orders" },
    ],
  },
  {
    label: "Relation & contenu",
    items: [
      { icon: Users, label: "Utilisateurs", href: "/admin/customers" },
      { icon: MessageSquare, label: "Avis clients", href: "/admin/reviews" },
      { icon: FileText, label: "Contenu", href: "/admin/settings" },
      { icon: Tag, label: "Promotions", href: "/admin/promotions" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { icon: FileText, label: "SEO & indexation", href: "/admin/settings" },
      { icon: FileText, label: "Informations légales", href: "/admin/settings" },
      { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ],
  },
];

export function isAdminRouteActive(location: string, href: string): boolean {
  return href === "/admin" ? location === "/admin" : location.startsWith(href);
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const [location] = useLocation();
  const avatarLetter = (user?.name || user?.email || "A").charAt(0).toUpperCase();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div data-admin-shell className="flex min-h-screen bg-[#f8f5ef] text-[#211e1b]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu d’administration"
          className="fixed inset-0 z-30 bg-[#211e1b]/35 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        aria-label="Navigation administration"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[88vw] flex-col border-r border-[#e8e1d8] bg-[#fbf9f5] transition-transform duration-300 lg:static lg:w-[18rem] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[#e8e1d8] px-5 py-5">
          <Link href="/admin" onClick={closeSidebar} className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#211e1b] font-display text-xl text-[#f8f5ef]">M</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[0.16em] text-[#211e1b]">MAZIGHO Admin</span>
              <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.16em] text-[#8b8178]">Espace privé</span>
            </span>
          </Link>
          <button type="button" aria-label="Fermer le menu d’administration" className="rounded-lg p-2 text-[#6d6259] hover:bg-[#eee8df] lg:hidden" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {menuSections.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p className="px-3 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8b8178]">{section.label}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isAdminRouteActive(location, item.href);
                  return (
                    <Link
                      key={`${section.label}-${item.label}`}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#f1e9df] font-semibold text-[#b65f3f]" : "text-[#6d6259] hover:bg-[#f1e9df] hover:text-[#211e1b]"}`}
                    >
                      <Icon aria-hidden="true" size={17} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#e8e1d8] p-3">
          <Link href="/" className="mb-1 flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6d6259] hover:bg-[#eee8df] hover:text-[#211e1b]">
            <ArrowLeft size={17} aria-hidden="true" />
            Retour au site
          </Link>
          <button type="button" onClick={() => void logout()} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#6d6259] hover:bg-[#f1e0d5] hover:text-[#a94c3a]">
            <LogOut size={17} aria-hidden="true" />
            Déconnexion
          </button>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f1e9df] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d9a078] font-semibold text-[#211e1b]">{avatarLetter}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#211e1b]">{user?.name || "Administrateur"}</p>
              <p className="truncate text-xs text-[#6d6259]">{user?.email || "Compte sécurisé"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-[#e8e1d8] bg-[#fbf9f5]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" aria-label="Ouvrir le menu d’administration" aria-expanded={sidebarOpen} className="rounded-xl p-2 text-[#6d6259] hover:bg-[#eee8df] lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={21} aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#b65f3f] sm:block">MAZIGHO · espace d’administration</p>
              <h1 className="truncate font-display text-xl font-semibold text-[#211e1b] sm:text-2xl">Pilotage de la boutique</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-[#f1e9df] px-3 py-2 text-xs font-semibold text-[#8b5a45] sm:inline-flex"><span className="h-2 w-2 rounded-full bg-[#41a46d]" /> Boutique opérationnelle</span>
            <Link href="/" className="hidden rounded-full border border-[#d5cec4] px-3 py-2 text-xs font-semibold text-[#514942] hover:border-[#b65f3f] hover:text-[#b65f3f] sm:inline-flex">Voir le site</Link>
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
