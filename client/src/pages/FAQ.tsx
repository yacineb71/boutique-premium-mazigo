import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const items = [
  ["Quels sont les délais de livraison ?", "Le délai estimé et les éventuels frais sont affichés avant la validation de votre commande, selon la destination et le produit."],
  ["Comment suivre ma commande ?", "Après connexion, ouvrez Mon compte puis Mes commandes pour consulter le statut disponible et le numéro de suivi lorsqu’il a été transmis."],
  ["Puis-je demander un retour ?", "Contactez-nous via le formulaire avec votre numéro de commande. Nous vous indiquerons les étapes applicables à votre situation."],
  ["Comment fonctionne le paiement ?", "Le paiement est traité de manière sécurisée par Stripe lors de la validation du panier. MAZIGHO ne conserve pas les données complètes de votre carte."],
  ["Comment contacter MAZIGHO ?", "Utilisez notre formulaire de contact ou écrivez à contact@mazigho.com. Une demande complète nous permet de vous répondre plus rapidement."],
] as const;

export default function FAQ() {
  return <div className="min-h-screen bg-[#f8f5ef] text-[#211e1b]"><Header /><main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">Aide MAZIGHO</p><h1 className="mt-3 font-display text-5xl font-semibold">Questions fréquentes</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#6d6259]">Les réponses essentielles avant, pendant et après votre commande.</p><div className="mt-12 space-y-3">{items.map(([question, answer]) => <details key={question} className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-5 shadow-[0_8px_30px_rgba(33,30,27,0.04)]"><summary className="cursor-pointer list-none pr-6 text-lg font-semibold">{question}</summary><p className="mt-4 max-w-3xl leading-7 text-[#6d6259]">{answer}</p></details>)}</div></main><Footer /></div>;
}
