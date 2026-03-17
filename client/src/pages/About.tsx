import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Users, Globe, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Qualité Premium",
      description: "Tous nos produits sont sélectionnés pour leur excellence et durabilité",
    },
    {
      icon: Users,
      title: "Service Client",
      description: "Équipe disponible 24/7 pour répondre à vos questions et préoccupations",
    },
    {
      icon: Globe,
      title: "Livraison Mondiale",
      description: "Nous livrons dans plus de 150 pays avec des tarifs compétitifs",
    },
    {
      icon: Heart,
      title: "Satisfaction Garantie",
      description: "Retour gratuit sous 30 jours si vous n'êtes pas satisfait",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Fondatrice & PDG",
      image: "👩‍💼",
      bio: "Passionnée par la mode et l'e-commerce depuis 15 ans",
    },
    {
      name: "Marc Dupont",
      role: "Directeur des Opérations",
      image: "👨‍💼",
      bio: "Expert en logistique et gestion de chaîne d'approvisionnement",
    },
    {
      name: "Emma Wilson",
      role: "Responsable Marketing",
      image: "👩‍💻",
      bio: "Créative et stratégiste en marketing digital",
    },
    {
      name: "David Chen",
      role: "Directeur Technique",
      image: "👨‍💻",
      bio: "Développeur passionné par les technologies innovantes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">À Propos de MAZIGHO</h1>
          <p className="text-xl text-teal-100">
            Votre destination de confiance pour les produits premium depuis 2015
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notre Histoire</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              MAZIGHO a été fondée en 2015 avec une vision simple : offrir aux clients une sélection
              curatée de produits premium à des prix justes. Ce qui a commencé comme une petite boutique
              en ligne est devenu l'une des plus grandes plateformes e-commerce de confiance en Europe.
            </p>
            <p>
              Nous croyons que la qualité ne doit pas être compromise. C'est pourquoi nous travaillons
              directement avec les meilleurs fabricants et fournisseurs du monde pour vous proposer
              les meilleurs produits dans les catégories Vêtements, Cosmétiques, Accessoires, Cadeaux et Jouets.
            </p>
            <p>
              Aujourd'hui, MAZIGHO compte plus de 500 000 clients satisfaits dans 150 pays et continue
              de croître. Nous sommes fiers de notre engagement envers l'excellence, l'intégrité et
              la satisfaction client.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                  <div className="flex justify-center mb-4">
                    <div className="bg-teal-100 p-4 rounded-lg">
                      <Icon size={32} className="text-teal-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-teal-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-teal-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <p className="text-teal-100">Clients Satisfaits</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <p className="text-teal-100">Pays Livrés</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-teal-100">Produits</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9+</div>
              <p className="text-teal-100">Années d'Expérience</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
