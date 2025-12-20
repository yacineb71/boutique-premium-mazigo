import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Mail, Clock } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ThankYou() {
  const [location, navigate] = useLocation();

  // Vérifier si l'utilisateur vient du formulaire de contact
  useEffect(() => {
    const fromContact = sessionStorage.getItem("from_contact_form");
    if (!fromContact) {
      // Rediriger vers la page d'accueil si l'accès direct
      navigate("/");
    } else {
      // Nettoyer le flag
      sessionStorage.removeItem("from_contact_form");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Success Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Main Message */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Merci pour votre message !
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Nous avons bien reçu votre demande et nous vous répondrons dans les meilleurs délais.
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Vérifiez votre email
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une confirmation à l'adresse email fournie.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Délai de réponse
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Notre équipe vous répondra dans les 24 à 48 heures.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <Card className="mb-12 bg-primary/5 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    En attendant notre réponse
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Consultez notre <button onClick={() => navigate("/faq")} className="text-primary hover:underline cursor-pointer">FAQ</button> pour des réponses immédiates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Explorez notre <button onClick={() => navigate("/shop")} className="text-primary hover:underline cursor-pointer">boutique</button> pour découvrir nos produits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>Consultez nos <button onClick={() => navigate("/faq")} className="text-primary hover:underline cursor-pointer">conditions générales</button> pour plus d'informations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  className="gap-2"
                >
                  <Home className="h-5 w-5" />
                  Retour à l'accueil
                </Button>
                <Button
                  onClick={() => navigate("/shop")}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  Continuer vos achats
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Support Section */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Besoin d'aide supplémentaire ?
              </h2>
              <p className="text-muted-foreground mb-6">
                N'hésitez pas à nous contacter à nouveau ou consultez notre FAQ pour plus d'informations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/contact")}
                  variant="outline"
                  size="lg"
                >
                  Nous contacter à nouveau
                </Button>
                <Button
                  onClick={() => navigate("/faq")}
                  size="lg"
                  className="gap-2"
                >
                  Consulter la FAQ
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
