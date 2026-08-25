import { useAuth } from "@/_core/hooks/useAuth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildCatalogSearchRoute, matchesCatalogSearch } from "@/lib/catalogSearch";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

const universes = [
  { name: "Mode & accessoires", description: "Les détails qui accompagnent votre style au quotidien.", icon: "◌", category: "Vêtements", image: "/manus-storage/mazigho-lifestyle-mode_b8020010.jpg" },
  { name: "Beauté & bien-être", description: "Des instants de soin et de confort à s’offrir.", icon: "✦", category: "Cosmétiques", image: "/manus-storage/mazigho-lifestyle-beaute_c3f430c7.jpg" },
  { name: "Maison & cuisine", description: "Des objets simples qui facilitent les petits moments.", icon: "⌂", category: "Cadeaux", image: "/manus-storage/mazigho-lifestyle-maison_b9558176.jpg" },
  { name: "Sport & plein air", description: "Pour bouger, respirer et profiter davantage.", icon: "↗", category: "Jouets", image: "/manus-storage/mazigho-lifestyle-utile_78e04000.jpg" },
  { name: "High-tech utile", description: "Des accessoires pensés pour rester connecté sans effort.", icon: "⌁", category: "Accessoires", image: "/manus-storage/mazigho-lifestyle-utile_78e04000.jpg" },
  { name: "Mobilité & auto", description: "Les indispensables pour vos trajets et vos escapades.", icon: "◍", category: "Accessoires", image: "/manus-storage/mazigho-lifestyle-utile_78e04000.jpg" },
];

const searchableUniverses = universes.map((universe) => `${universe.name} ${universe.description}`);

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: activeBanners } = trpc.content.banners.active.useQuery();

  const matchingUniverseCount = useMemo(() => {
    if (!searchTerm.trim()) return universes.length;
    return searchableUniverses.filter((value) => matchesCatalogSearch(value, searchTerm)).length;
  }, [searchTerm]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocation(buildCatalogSearchRoute(searchTerm));
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#211e1b]">
      <Header />

      <main>
        {activeBanners && activeBanners.length > 0 ? <section className="border-b border-[#eadfd4] bg-[#b65f3f] px-4 py-4 text-white sm:px-6"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">{activeBanners.slice(0, 1).map((banner) => <div key={banner.id}><p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">{banner.eyebrow || "MAZIGHO"}</p><p className="mt-1 font-display text-xl">{banner.title}</p>{banner.description ? <p className="mt-1 text-sm text-white/80">{banner.description}</p> : null}</div>)}{activeBanners[0].ctaLabel && activeBanners[0].ctaHref ? <Link href={activeBanners[0].ctaHref} className="inline-flex shrink-0 items-center rounded-full bg-[#f8f5ef] px-5 py-2 text-sm font-semibold text-[#211e1b] transition hover:bg-white">{activeBanners[0].ctaLabel}<ArrowRight size={15} className="ml-2"/></Link> : null}</div></section> : null}
        <section className="relative isolate overflow-hidden bg-[#211e1b] text-[#f8f5ef]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_74%_28%,rgba(196,115,83,0.7),transparent_33%),radial-gradient(circle_at_12%_90%,rgba(105,80,59,0.6),transparent_36%),linear-gradient(112deg,#211e1b_0%,#3a2e29_48%,#8c5947_100%)]" />
          <div className="absolute right-[-8%] top-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full border border-white/10 bg-[#f0d2ba]/10 blur-sm" />
          <div className="mx-auto grid min-h-[39rem] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="mazigho-eyebrow mb-5 text-[#e7a17f]">MAZIGHO · SÉLECTION DU MOMENT</p>
              <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Découvrez nos<br /><em className="font-normal text-[#e7a17f]">meilleures offres.</em></h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#e9ded4] sm:text-lg">Des trouvailles utiles, belles et accessibles pour simplifier votre quotidien avec style.</p>

              <form onSubmit={submitSearch} className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur sm:flex-row">
                <label htmlFor="home-search" className="sr-only">Rechercher un produit ou une catégorie</label>
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f8f5ef] px-4 py-3 text-[#211e1b]">
                  <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#b65f3f]" />
                  <input id="home-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher un produit…" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8b8178]" />
                </div>
                <button type="submit" className="rounded-xl bg-[#c56f4b] px-6 py-3 font-semibold text-white transition hover:bg-[#a95538]">Rechercher</button>
              </form>
              <p className="mt-3 text-xs text-[#d7c5b8]" aria-live="polite">{searchTerm.trim() ? `${matchingUniverseCount} univers correspondant${matchingUniverseCount > 1 ? "s" : ""}` : "Une expérience simple, de l’inspiration au panier."}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-[#f8f5ef] px-6 py-3 text-sm font-semibold text-[#211e1b] transition hover:bg-white">Découvrir la boutique <ArrowRight size={16} className="ml-2" /></Link>
                <Link href="/shop?sort=popular" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Voir les best-sellers</Link>
              </div>
            </div>

            <div className="relative mx-auto aspect-[0.88] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-[#c8a38c]/20 p-4 shadow-2xl shadow-black/20">
              <img src="/manus-storage/mazigho-lifestyle-hero_60bee52d.jpg" alt="Sélection éditoriale MAZIGHO de mode, soin, maison et accessoires" width="960" height="1080" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211e1b]/80 via-[#211e1b]/20 to-transparent" />
              <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] bg-[#211e1b]/10 p-7 text-[#f8f5ef]">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]"><span>Édition 01</span><span>2026</span></div>
                <div>
                  <div className="mb-5 text-7xl opacity-80">✦</div>
                  <p className="mazigho-eyebrow text-[#6b4132]">L’INSPIRATION MAZIGHO</p>
                  <h2 className="mt-3 font-display text-4xl leading-tight">Des trouvailles qui embellissent le quotidien.</h2>
                </div>
                <div className="flex items-center justify-between border-t border-[#211e1b]/20 pt-4 text-xs font-medium uppercase tracking-[0.16em]"><span>Mode · maison · soin</span><span>CHF</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Une sélection qui a du sens", "Des trouvailles utiles pour chaque moment du quotidien."],
            ["Prix affichés clairement", "Une expérience pensée pour vous laisser décider sereinement."],
            ["Un parcours simple", "Du produit au panier en quelques clics, sans détour."],
          ].map(([title, text]) => <div key={title} className="border-t border-[#211e1b]/15 pt-5"><p className="mazigho-eyebrow mb-3">MAZIGHO</p><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6d6259]">{text}</p></div>)}
        </section>

        <section className="bg-[#ede7de] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mazigho-eyebrow mb-3">EXPLORER MAZIGHO</p><h2 className="font-display text-4xl sm:text-5xl">Découvrez nos univers</h2></div><Link href="/shop" className="text-sm font-semibold text-[#b65f3f] underline decoration-[#b65f3f]/40 underline-offset-4">Voir toute la boutique <ArrowRight size={15} className="ml-1 inline" /></Link></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {universes.map((universe) => <Link key={universe.name} href={`/shop?category=${encodeURIComponent(universe.category)}`} className="group relative min-h-64 overflow-hidden rounded-3xl bg-[#211e1b] p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"><img src={universe.image} alt="" width="640" height="800" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} /><div className="absolute inset-0 bg-gradient-to-t from-[#211e1b]/90 via-[#211e1b]/25 to-transparent" /><div className="relative flex h-full flex-col justify-between"><span className="text-4xl text-white/80">{universe.icon}</span><div><h3 className="font-display text-2xl">{universe.name}</h3><p className="mt-2 max-w-xs text-sm leading-5 text-white/80">{universe.description}</p><span className="mt-5 inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-white/90">Explorer <ArrowRight size={14} className="ml-2 transition group-hover:translate-x-1" /></span></div></div></Link>)}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-[27rem] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_60%_25%,#e7c1a8,transparent_28%),linear-gradient(145deg,#a87257,#3b302c)] p-8 text-[#f8f5ef] sm:p-12"><div className="absolute bottom-[-3rem] right-[-2rem] h-64 w-64 rounded-full border-[22px] border-white/10" /><div className="relative flex h-full flex-col justify-between"><p className="mazigho-eyebrow text-[#f1b18d]">NOTRE INSPIRATION</p><div><span className="font-display text-8xl leading-none text-white/30">“</span><h2 className="font-display text-4xl leading-tight sm:text-5xl">L’histoire inspirante de MAZIGHO.</h2></div><p className="max-w-sm text-sm leading-6 text-white/75">Choisir avec attention. Simplifier la recherche. Inspirer le quotidien.</p></div></div>
          <div><p className="mazigho-eyebrow mb-4">L’ESPRIT MAZIGHO</p><h2 className="font-display text-4xl leading-tight sm:text-5xl">Des trouvailles pour accompagner les moments qui comptent.</h2><p className="mt-6 leading-7 text-[#6d6259]">MAZIGHO est né d’une idée simple : rendre les bonnes découvertes plus accessibles. Nous réunissons mode, bien-être, maison et accessoires dans une boutique claire, chaleureuse et pensée pour vous laisser explorer librement.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/about" className="inline-flex items-center rounded-full bg-[#211e1b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3a332f]">Découvrir l’univers</Link><Link href="/contact" className="inline-flex items-center rounded-full border border-[#b8ada1] px-6 py-3 text-sm font-semibold text-[#514942] hover:bg-[#eee8df]">Nous contacter</Link></div></div>
        </section>

        <section className="bg-[#211e1b] px-4 py-16 text-[#f8f5ef] sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div><p className="mazigho-eyebrow mb-3 text-[#e7a17f]">LA SÉLECTION DU MOMENT</p><h2 className="font-display text-4xl sm:text-5xl">Le détail qui fait la différence.</h2><p className="mt-3 max-w-xl text-[#cfc2b7]">Explorez le catalogue et trouvez la pièce qui donnera une nouvelle allure à votre quotidien.</p></div><Link href="/shop" className="inline-flex shrink-0 items-center rounded-full bg-[#c56f4b] px-7 py-3 text-sm font-semibold text-white hover:bg-[#a95538]">Découvrir la sélection <ArrowRight size={16} className="ml-2" /></Link></div></section>

        {isAuthenticated && <section className="border-b border-[#e3dbd1] bg-[#f0e9df] px-4 py-5"><p className="mx-auto max-w-7xl text-center text-sm text-[#514942]">Bienvenue, <strong>{user?.name || user?.email}</strong> ! {user?.role === "admin" && <Link href="/admin" className="font-semibold text-[#b65f3f] underline">Accéder à l’admin</Link>}</p></section>}
      </main>

      <Footer />
    </div>
  );
}
