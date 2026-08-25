import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useRoute } from "wouter";

const content = {
  terms: { label: "Informations légales", title: "Conditions générales", paragraphs: ["Cette page présente les conditions applicables à l’utilisation de la boutique MAZIGHO et à la validation d’une commande.", "Avant tout achat, le prix, la disponibilité, la destination et les conditions de livraison sont affichés dans le parcours de commande."] },
  "shipping-returns": { label: "Service client", title: "Livraison et retours", paragraphs: ["Les délais et frais de livraison applicables sont indiqués avant la confirmation de la commande.", "Pour une demande de retour, contactez MAZIGHO depuis le formulaire en indiquant votre numéro de commande afin que notre équipe vous accompagne."] },
  privacy: { label: "Données personnelles", title: "Politique de confidentialité", paragraphs: ["MAZIGHO utilise uniquement les informations nécessaires au traitement des comptes, commandes, paiements et demandes de contact.", "Les données de paiement sont traitées par Stripe. Pour toute question relative à vos données, utilisez le formulaire de contact."] },
} as const;

export default function Legal() {
  const [, params] = useRoute("/legal/:section");
  const page = content[(params?.section ?? "terms") as keyof typeof content] ?? content.terms;
  return <div className="min-h-screen bg-[#f8f5ef] text-[#211e1b]"><Header /><main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">{page.label}</p><h1 className="mt-3 font-display text-5xl font-semibold">{page.title}</h1><div className="mt-10 space-y-6 rounded-3xl border border-[#e5dbd0] bg-[#fffdf9] p-6 leading-8 text-[#6d6259] shadow-[0_8px_30px_rgba(33,30,27,0.04)] sm:p-10">{page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p>Pour toute demande complémentaire, <a className="font-semibold text-[#b65f3f] underline" href="/contact">contactez-nous</a>.</p></div></main><Footer /></div>;
}
