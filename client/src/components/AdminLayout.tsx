import { useAuth } from "@/_core/hooks/useAuth";
import {
  BarChart3,
  FolderOpen,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Produits", href: "/admin/products" },
  { icon: FolderOpen, label: "Catégories", href: "/admin/categories" },
  { icon: ShoppingCart, label: "Commandes", href: "/admin/orders" },
  { icon: Users, label: "Clients", href: "/admin/customers" },
  { icon: Tag, label: "Promotions", href: "/admin/promotions" },
  { icon: MessageSquare, label: "Avis", href: "/admin/reviews" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
] as const;

export function isAdminRouteActive(location: string, href: string): boolean {
  return href === "/admin" ? location === "/admin" : location.startsWith(href);
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const [location] = useLocation();

  const closeSidebar = () => setSidebarOpen(false);
  const avatarLetter = (user?.name || user?.email || "A").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu d’administration"
          className="fixed inset-0 z-30 bg-gray-950/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        aria-label="Navigation administration"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col bg-gray-900 text-white shadow-xl transition-transform duration-300 lg:static lg:w-64 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h1 className="truncate text-lg font-bold sm:text-xl">MAZIGHO Admin</h1>
          <button
            type="button"
            aria-label="Fermer le menu d’administration"
            className="rounded p-2 text-gray-300 hover:bg-gray-800 hover:text-white lg:hidden"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isAdminRouteActive(location, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex min-h-11 items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon aria-hidden="true" size={20} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-3 sm:p-4">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex min-h-11 w-full items-center gap-4 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LogOut aria-hidden="true" size={20} className="shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Ouvrir le menu d’administration"
              aria-expanded={sidebarOpen}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu aria-hidden="true" size={22} />
            </button>
            <h2 className="truncate text-lg font-bold text-gray-900 sm:text-2xl">Panel d’Administration</h2>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm text-gray-600 sm:block">{user?.name || user?.email}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 font-bold text-white sm:h-10 sm:w-10">
              {avatarLetter}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
