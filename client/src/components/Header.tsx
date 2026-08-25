import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/contexts/ThemeContext";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/shop" },
  { label: "À découvrir", href: "/shop" },
  { label: "Best-sellers", href: "/shop?sort=popular" },
  { label: "Contact", href: "/contact" },
];

const categoryLinks = [
  { label: "Mode & accessoires", href: "/shop?category=V%C3%AAtements" },
  { label: "Beauté & bien-être", href: "/shop?category=Cosm%C3%A9tiques" },
  { label: "Maison & cuisine", href: "/shop?category=Cadeaux" },
  { label: "Sport & plein air", href: "/shop?category=Jouets" },
  { label: "High-tech utile", href: "/shop?category=Accessoires" },
];

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f5]/95 text-[#211e1b] shadow-[0_1px_0_rgba(33,30,27,0.08)] backdrop-blur">
      <div className="bg-[#211e1b] px-4 py-2 text-center text-[0.68rem] font-medium tracking-[0.16em] text-[#f8f5ef]">
        UNE SÉLECTION PENSÉE POUR LE QUOTIDIEN <span className="mx-2 text-[#d77956]">·</span> LIVRAISON TRANSPARENTE SELON LA DESTINATION
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[4.6rem] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211e1b] font-display text-xl text-[#f8f5ef]">M</span>
            <span>
              <span className="block text-lg font-semibold tracking-[0.18em]">MAZIGHO</span>
              <span className="hidden text-[0.58rem] uppercase tracking-[0.2em] text-[#8b8178] sm:block">Trouvailles du quotidien</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-[0.78rem] font-medium tracking-wide text-[#514942] transition hover:text-[#b65f3f]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => toggleTheme?.()}
              aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
              aria-pressed={theme === "dark"}
              className="rounded-full p-2 text-[#514942] transition hover:bg-[#eee8df] hover:text-[#b65f3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b65f3f] dark:text-[#f1d5c6] dark:hover:bg-[#3a332f]"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/shop" aria-label="Rechercher un produit" className="rounded-full p-2 text-[#514942] transition hover:bg-[#eee8df] hover:text-[#b65f3f]">
              <Search size={18} />
            </Link>
            <Link href="/cart" aria-label={`Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`} className="relative rounded-full p-2 text-[#514942] transition hover:bg-[#eee8df] hover:text-[#b65f3f]">
              <ShoppingBag size={19} />
              {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b65f3f] px-1 text-[0.6rem] text-white">{itemCount}</span>}
            </Link>
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => logout()} className="border-[#d5cec4] text-[#514942]">Déconnexion</Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => { window.location.href = getLoginUrl(); }} className="ml-2 rounded-full bg-[#b65f3f] px-5 text-white hover:bg-[#964b32]">
                <UserRound size={15} className="mr-2" /> Mon compte
              </Button>
            )}
          </div>

          <button className="rounded-full p-2 text-[#211e1b] md:hidden" aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden items-center gap-6 border-t border-[#e8e1d8] py-2.5 md:flex xl:hidden">
          {navLinks.slice(0, 4).map((link) => <Link key={link.label} href={link.href} className="text-xs font-medium text-[#514942] hover:text-[#b65f3f]">{link.label}</Link>)}
          <Link href="/shop" className="ml-auto text-xs font-semibold text-[#b65f3f]">Voir toute la boutique</Link>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#e8e1d8] pb-5 pt-4 md:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <Link key={`${link.label}-${link.href}`} href={link.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-[#514942] hover:bg-[#eee8df]">{link.label}</Link>
              ))}
            </div>
            <div className="mt-3 border-t border-[#e8e1d8] pt-3">
              <p className="mazigho-eyebrow px-3 pb-2">Nos univers</p>
              {categoryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-[#6d6259] hover:bg-[#eee8df]">{link.label}</Link>)}
            </div>
            <div className="mt-3 grid gap-2 px-3">
              <button
                type="button"
                onClick={() => toggleTheme?.()}
                aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
                aria-pressed={theme === "dark"}
                className="flex items-center justify-center gap-2 rounded-full border border-[#d5cec4] px-4 py-2 text-sm text-[#514942] transition hover:bg-[#eee8df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b65f3f] dark:border-[#6d6259] dark:text-[#f1d5c6] dark:hover:bg-[#3a332f]"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Thème clair" : "Thème sombre"}
              </button>
              <div className="flex gap-2">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-full border border-[#d5cec4] px-4 py-2 text-center text-sm">Panier ({itemCount})</Link>
                {isAuthenticated ? <button onClick={() => logout()} className="flex-1 rounded-full bg-[#211e1b] px-4 py-2 text-sm text-white">Déconnexion</button> : <button onClick={() => { window.location.href = getLoginUrl(); }} className="flex-1 rounded-full bg-[#b65f3f] px-4 py-2 text-sm text-white">Mon compte</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
