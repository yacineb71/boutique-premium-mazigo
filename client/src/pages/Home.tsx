import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingBag, Sparkles, Truck, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

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

  const categories = [
    { name: "Vêtements", image: "👕", count: "120+ produits" },
    { name: "Cosmétiques", image: "💄", count: "85+ produits" },
    { name: "Accessoires", image: "👜", count: "95+ produits" },
    { name: "Cadeaux", image: "🎁", count: "70+ produits" },
    { name: "Jouets", image: "🧸", count: "60+ produits" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenue chez MAZIGHO
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-teal-50">
            Votre boutique premium pour vêtements, cosmétiques, accessoires, cadeaux et jouets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Découvrir la Boutique
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/api/oauth/callback">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Se Connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir MAZIGHO ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-teal-100 p-4 rounded-full">
                      <Icon className="text-teal-600" size={32} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/shop?category=${category.name.toLowerCase()}`}>
                <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer">
                  <div className="text-6xl mb-4">{category.image}</div>
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Faire Vos Achats ?</h2>
          <p className="text-lg mb-8 text-teal-50">
            Explorez notre collection complète et trouvez exactement ce que vous cherchez.
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
              Commencer à Magasiner
            </Button>
          </Link>
        </div>
      </section>

      {/* User Info (if logged in) */}
      {isAuthenticated && (
        <section className="bg-blue-50 border-t border-blue-200 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-blue-900">
              Bienvenue, <strong>{user?.name || user?.email}</strong> !
              {user?.role === "admin" && (
                <>
                  {" "}Vous avez accès à l'
                  <Link href="/admin" className="text-blue-600 hover:underline">
                    admin panel
                  </Link>
                </>
              )}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
