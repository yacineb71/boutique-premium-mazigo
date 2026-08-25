import React from "react";
import { Link } from "wouter";
import { Newsletter } from "./Newsletter";

export const footerNavigation = [
  ["Accueil", "/"],
  ["Boutique", "/shop"],
  ["À propos", "/about"],
  ["Contact", "/contact"],
  ["FAQ", "/faq"],
] as const;

export const footerLegalLinks = [
  ["Conditions générales", "/legal/terms"],
  ["Livraison et retours", "/legal/shipping-returns"],
  ["Politique de confidentialité", "/legal/privacy"],
] as const;

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
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.8fr_1fr_1.25fr]">
            <div>
              <Link href="/" className="flex items-center gap-3 text-[#f8f5ef]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f5ef] font-display text-xl text-[#211e1b]">M</span><span className="text-lg font-semibold tracking-[0.18em]">MAZIGHO</span></Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[#9f9186]">Une boutique locale dans sa façon de parler, ouverte sur les meilleures trouvailles.</p>
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#e7a17f]">CHF · Suisse & Europe</p>
            </div>
            <div><h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Navigation</h3><div className="grid gap-3 text-sm">{footerNavigation.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[#e7a17f]">{label}</Link>)}</div></div>
            <div><h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Catégories</h3><div className="grid gap-3 text-sm">{categoryLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[#e7a17f]">{label}</Link>)}</div></div>
            <div><h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f5ef]">Besoin d’aide ?</h3><p className="text-sm leading-6 text-[#b9aaa0]">Retrouvez les réponses aux questions les plus fréquentes sur la livraison, les commandes et les retours.</p><Link href="/faq" className="mt-4 inline-flex text-sm font-semibold text-[#e7a17f] hover:text-[#f3c2a9]">Consulter la FAQ →</Link></div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-[#4a3d35] pt-6 text-xs text-[#8d8076] sm:flex-row sm:items-center sm:justify-between"><p>© {currentYear} MAZIGHO. Tous droits réservés.</p><div className="flex flex-wrap gap-x-5 gap-y-2">{footerLegalLinks.map(([label, href]) => <Link key={href} href={href} className="hover:text-[#e7a17f]">{label}</Link>)}</div></div>
        </div>
      </footer>
    </>
  );
}
