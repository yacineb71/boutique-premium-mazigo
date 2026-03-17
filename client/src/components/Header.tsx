import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
            <span className="font-bold text-lg text-gray-900">{APP_TITLE}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              Accueil
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-gray-900 transition">
              Boutique
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">
              À Propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">
              Contact
            </Link>
          </nav>

          {/* Cart Button */}
          <Link href="/cart" className="hidden md:flex">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Accueil
            </Link>
            <Link href="/shop" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Boutique
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              À Propos
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Contact
            </Link>
            <Link href="/cart" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Panier ({itemCount})
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Connexion
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
