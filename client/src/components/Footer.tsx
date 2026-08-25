import React from "react";
import { Link } from "wouter";
import { Newsletter } from "./Newsletter";

const categoryLinks = [
  ["High-tech utile", "/shop?category=Accessoires"],
  ["Maison & cuisine", "/shop?category=Cadeaux"],
  ["Beauté & bien-être", "/shop?category=Cosmétiques"],
  ["Sport & plein air", "/shop?category=Jouets"],
  ["Mode & accessoires", "/shop?category=Vêtements"],
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Newsletter />
      <footer className="bg-[#211e1b] text-[#cfc2b7]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.8fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-3 text-[#f8f5ef]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f5ef] font-display text-xl text-[#211e1b]">M</span>
                <span className="text-lg font-semibold tracking-[0.18em]">MAZIGHO</span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[#9f9186]">Une boutique locale dans sa façon de parler, ouverte sur les meilleures trouvailles.</p>
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#e7a17f]">CHF · Suisse & Europe</p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Navigation</h3>
              <div className="grid gap-3 text-sm">
                <Link href="/" className="transition hover:text-[#e7a17f]">Accueil</Link>
                <Link href="/shop" className="transition hover:text-[#e7a17f]">Boutique</Link>
                <Link href="/about" className="transition hover:text-[#e7a17f]">À propos</Link>
                <Link href="/contact" className="transition hover:text-[#e7a17f]">Contact</Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Catégories</h3>
              <div className="grid gap-3 text-sm">
                {categoryLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[#e7a17f]">{label}</Link>)}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Besoin d’aide ?</h3>
              <div className="grid gap-3 text-sm">
                <Link href="/contact" className="transition hover:text-[#e7a17f]">Écrivez-nous via le formulaire</Link>
                <a href="mailto:contact@mazigho.com" className="transition hover:text-[#e7a17f]">contact@mazigho.com</a>
                <span className="text-[#9f9186]">Livraison et retours précisés avant validation.</span>
                <span className="text-[#9f9186]">Navigation protégée par HTTPS.</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#4a3d35] pt-6 text-xs text-[#8d8076] sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} MAZIGHO. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span>Conditions générales</span>
              <span>Livraison et retours</span>
              <span>Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
