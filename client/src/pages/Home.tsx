import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildCatalogSearchRoute, matchesCatalogSearch } from "@/lib/catalogSearch";
import { Search, ShoppingBag, Shield, Sparkles, Truck } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

const categories = [
  { name: "Vêtements", image: "👕", count: "120+ produits" },
  { name: "Cosmétiques", image: "💄", count: "85+ produits" },
  { name: "Accessoires", image: "👜", count: "95+ produits" },
  { name: "Cadeaux", image: "🎁", count: "70+ produits" },
  { name: "Jouets", image: "🧸", count: "60+ produits" },
];

const searchableCategories = categories.map((category) => `${category.name} ${category.count}`);

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const features = [
    {
      icon: ShoppingBag,
      title: "Large Sélection",
      description: "Découvrez notre collection complète de vêtements, cosmétiques, accessoires, cadeaux et jouets.",
    },
    {
      icon: Truck,
      title: "Livraison Rapide",
      description: "Livraison gratuite à partir de 50€. Recevez vos commandes en 2-3 jours ouvrables.",
    },
    {
      icon: Shield,
      title: "Paiement Sécurisé",
      description: "Vos transactions sont protégées par les meilleurs systèmes de sécurité.",
    },
    {
      icon: Sparkles,
      title: "Qualité Premium",
      description: "Tous nos produits sont sélectionnés pour leur qualité et leur durabilité.",
    },
  ];

  const matchingCategoryCount = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories.length;
    }

    return searchableCategories.filter((value) => matchesCatalogSearch(value, searchTerm)).length;
  }, [searchTerm]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocation(buildCatalogSearchRoute(searchTerm));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <section className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">Bienvenue chez MAZIGHO</h1>
          <p className="mx-auto mb-8 max-w-4xl text-lg text-teal-50 sm:text-xl md:text-2xl">
            Votre boutique premium pour vêtements, cosmétiques, accessoires, cadeaux et jouets
          </p>

          <form onSubmit={submitSearch} className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white/15 p-3 text-left shadow-lg backdrop-blur-sm sm:flex-row">
            <label htmlFor="home-search" className="sr-only">Rechercher un produit ou une catégorie</label>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-gray-900">
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-teal-600" />
              <input
                id="home-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Rechercher un produit ou une catégorie…"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-500"
              />
            </div>
            <Button type="submit" size="lg" className="bg-yellow-400 text-gray-950 hover:bg-yellow-300 sm:px-7">
              Rechercher
            </Button>
          </form>
          <p className="mb-8 text-sm text-teal-50" aria-live="polite">
            {searchTerm.trim()
              ? `${matchingCategoryCount} catégorie${matchingCategoryCount > 1 ? "s" : ""} correspondante${matchingCategoryCount > 1 ? "s" : ""}`
              : "Trouvez rapidement ce qui vous ferait plaisir"}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop">
              <Button size="lg" className="w-full bg-white text-teal-600 hover:bg-gray-100 sm:w-auto">
                Découvrir la Boutique
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/api/oauth/callback">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 sm:w-auto">
                  Se Connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Pourquoi Choisir MAZIGHO ?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-teal-100 p-4"><Icon className="text-teal-600" size={32} /></div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Nos Catégories</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.name} href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}>
                <Card className="cursor-pointer p-8 text-center transition hover:shadow-lg">
                  <div className="mb-4 text-6xl">{category.image}</div>
                  <h3 className="mb-2 text-lg font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Prêt à Faire Vos Achats ?</h2>
          <p className="mb-8 text-lg text-teal-50">Explorez notre collection complète et trouvez exactement ce que vous cherchez.</p>
          <Link href="/shop">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">Commencer à Magasiner</Button>
          </Link>
        </div>
      </section>

      {isAuthenticated && (
        <section className="border-t border-blue-200 bg-blue-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-blue-900">
              Bienvenue, <strong>{user?.name || user?.email}</strong> !
              {user?.role === "admin" && (
                <> {" "}Vous avez accès à l'<Link href="/admin" className="text-blue-600 hover:underline">admin panel</Link></>
              )}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
