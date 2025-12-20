import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQSection, { FAQItem } from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// Données FAQ
const faqItems: FAQItem[] = [
  {
    id: "livraison-1",
    category: "Livraison",
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les délais de livraison varient selon votre localisation. Pour la France métropolitaine, comptez 3 à 5 jours ouvrables. Pour les DOM-TOM et l'international, les délais peuvent être plus longs. Vous recevrez un numéro de suivi après l'expédition.",
  },
  {
    id: "livraison-2",
    category: "Livraison",
    question: "Livrez-vous à l'étranger ?",
    answer:
      "Oui, nous livrons dans plus de 50 pays. Les frais de port varient selon la destination. Vous pouvez vérifier les frais de livraison lors du passage de votre commande.",
  },
  {
    id: "livraison-3",
    category: "Livraison",
    question: "Puis-je modifier ma commande après l'avoir passée ?",
    answer:
      "Si votre commande n'a pas encore été expédiée, nous pouvons la modifier ou l'annuler. Contactez-nous rapidement à contact@mazigho.fr avec votre numéro de commande.",
  },
  {
    id: "paiement-1",
    category: "Paiement",
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les virements bancaires. Tous les paiements sont sécurisés et chiffrés.",
  },
  {
    id: "paiement-2",
    category: "Paiement",
    question: "Mon paiement est-il sécurisé ?",
    answer:
      "Oui, tous les paiements sont traités par des prestataires de paiement certifiés et sécurisés. Nous utilisons le protocole SSL pour protéger vos données bancaires.",
  },
  {
    id: "paiement-3",
    category: "Paiement",
    question: "Puis-je payer en plusieurs fois ?",
    answer:
      "Oui, nous proposons des solutions de paiement en 3 ou 4 fois sans frais pour les commandes supérieures à 100€. Cette option est disponible lors du passage de la commande.",
  },
  {
    id: "retours-1",
    category: "Retours",
    question: "Quelle est votre politique de retour ?",
    answer:
      "Vous avez 30 jours à compter de la réception de votre commande pour retourner vos articles. Les articles doivent être en parfait état, non portés et avec leurs étiquettes d'origine.",
  },
  {
    id: "retours-2",
    category: "Retours",
    question: "Comment effectuer un retour ?",
    answer:
      "Connectez-vous à votre compte, allez dans 'Mes commandes' et cliquez sur 'Retourner un article'. Imprimez l'étiquette de retour et envoyez votre colis à notre centre de retour.",
  },
  {
    id: "retours-3",
    category: "Retours",
    question: "Suis-je remboursé des frais de port pour les retours ?",
    answer:
      "Les frais de port retour sont à votre charge, sauf en cas de défaut ou d'erreur de notre part. Nous vous rembourserons le prix du produit dans les 14 jours suivant la réception du retour.",
  },
  {
    id: "compte-1",
    category: "Compte",
    question: "Comment créer un compte ?",
    answer:
      "Cliquez sur 'Mon compte' en haut à droite, puis sur 'Créer un compte'. Remplissez le formulaire avec vos informations et validez. Vous recevrez un email de confirmation.",
  },
  {
    id: "compte-2",
    category: "Compte",
    question: "J'ai oublié mon mot de passe",
    answer:
      "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Entrez votre adresse email et suivez les instructions pour réinitialiser votre mot de passe.",
  },
  {
    id: "compte-3",
    category: "Compte",
    question: "Comment supprimer mon compte ?",
    answer:
      "Pour supprimer votre compte, contactez-nous à contact@mazigho.fr avec votre demande. Nous traiterons votre demande dans les 7 jours ouvrables.",
  },
  {
    id: "produits-1",
    category: "Produits",
    question: "Les produits sont-ils authentiques ?",
    answer:
      "Oui, tous nos produits sont 100% authentiques. Nous travaillons directement avec les marques ou des distributeurs autorisés. Chaque produit est vérifié avant l'expédition.",
  },
  {
    id: "produits-2",
    category: "Produits",
    question: "Avez-vous un guide des tailles ?",
    answer:
      "Oui, chaque produit dispose d'un guide des tailles détaillé. Vous pouvez le consulter sur la page du produit. N'hésitez pas à nous contacter si vous avez des doutes.",
  },
  {
    id: "produits-3",
    category: "Produits",
    question: "Les produits sont-ils en stock ?",
    answer:
      "L'indicateur de stock sur chaque produit est mis à jour en temps réel. Si un produit est en rupture de stock, vous pouvez vous inscrire pour être notifié quand il sera de nouveau disponible.",
  },
];

export default function Contact() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSending(true);

    try {
      // Préparer les données du formulaire
      const form = e.currentTarget;
      const formDataToSend = new FormData(form);

      // Envoyer à Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSend as any).toString(),
      });

      if (response.ok) {
        toast.success("Message envoyé avec succès !", {
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Réinitialiser le formulaire
        form.reset();
        // Rediriger vers la page de remerciements
        sessionStorage.setItem("from_contact_form", "true");
        setTimeout(() => {
          navigate("/thank-you");
        }, 1500);
      } else {
        toast.error("Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur s'est produite lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16 md:py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contactez-Nous
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une question ? Une suggestion ? Notre équipe est à votre écoute et vous répondra dans les meilleurs délais.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Questions Fréquemment Posées"
          description="Trouvez les réponses à vos questions les plus courantes"
          items={faqItems}
          showCategories={true}
        />

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Informations de Contact
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <p className="text-muted-foreground">contact@mazigho.fr</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                        <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Lun - Ven : 9h - 18h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                        <p className="text-muted-foreground">
                          123 Rue de la Mode<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Envoyez-nous un Message
                    </h2>
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      name="contact"
                      method="POST"
                      data-netlify="true"
                    >
                      {/* Champ caché pour Netlify */}
                      <input type="hidden" name="form-name" value="contact" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Votre nom"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Objet de votre message"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Votre message..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={isSending}
                      >
                        {isSending ? (
                          <>Envoi en cours...</>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
