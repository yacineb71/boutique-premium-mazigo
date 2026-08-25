import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, MapPin, Clock, Loader2, Send } from "lucide-react";
import { useState } from "react";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        setFormData(initialForm);
      } else setFeedback({ type: "error", message: result.message });
    },
    onError: (error) => setFeedback({ type: "error", message: error.message || "Vérifiez les champs puis réessayez." }),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    sendMessage.mutate(formData);
  };

  const contactInfo = [
    { icon: Mail, title: "Email", value: "contact@mazigho.com", description: "Réponse dès que possible" },
    { icon: Phone, title: "Téléphone", value: "+33 1 23 45 67 89", description: "Lun–Ven · 9h–18h" },
    { icon: MapPin, title: "Adresse", value: "Paris, France", description: "Écrivez-nous avant de vous déplacer" },
    { icon: Clock, title: "Disponibilité", value: "Support en ligne", description: "Via le formulaire de contact" },
  ];

  return <div className="min-h-screen flex flex-col bg-[#f8f5ef] text-[#211e1b]"><Header /><section className="bg-gradient-to-br from-[#211e1b] via-[#3a2d28] to-[#b65f3f] px-4 py-20 text-white"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e7a17f]">Service MAZIGHO</p><h1 className="mt-4 font-display text-5xl font-semibold">Nous contacter</h1><p className="mt-5 text-xl text-[#f1d5c6]">Une question sur une commande, un produit ou une livraison ?</p></div></section><section className="px-4 py-14 sm:py-20"><div className="mx-auto max-w-6xl"><div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{contactInfo.map(({ icon: Icon, title, value, description }) => <Card key={title} className="border-[#e5dbd0] bg-[#fffdf9] p-6 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4dfd3] text-[#b65f3f]"><Icon size={23} /></div><h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b5a45]">{title}</h2><p className="mt-2 font-semibold text-[#211e1b]">{value}</p><p className="mt-1 text-sm text-[#6d6259]">{description}</p></Card>)}</div><Card className="mx-auto max-w-3xl border-[#e5dbd0] bg-[#fffdf9] p-6 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b65f3f]">Réponse directe</p><h2 className="mt-2 font-display text-3xl font-semibold">Envoyez-nous un message</h2><p className="mt-3 text-[#6d6259]">Les champs marqués d’un astérisque sont nécessaires pour traiter votre demande.</p>{feedback ? <div role="status" className={`mt-6 rounded-xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-[#bfe2ce] bg-[#edf8f1] text-[#276749]" : "border-[#efc1b5] bg-[#fff1ed] text-[#9b3d27]"}`}>{feedback.message}</div> : null}<form onSubmit={handleSubmit} className="mt-8 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-[#514942]">Nom *<input required minLength={2} name="name" value={formData.name} onChange={handleChange} className="mt-2 h-11 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" placeholder="Votre nom" /></label><label className="block text-sm font-semibold text-[#514942]">Email *<input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 h-11 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" placeholder="vous@exemple.com" /></label></div><label className="block text-sm font-semibold text-[#514942]">Sujet *<input required minLength={3} name="subject" value={formData.subject} onChange={handleChange} className="mt-2 h-11 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" placeholder="Le sujet de votre demande" /></label><label className="block text-sm font-semibold text-[#514942]">Message *<textarea required minLength={10} name="message" value={formData.message} onChange={handleChange} rows={6} className="mt-2 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] p-3 font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" placeholder="Expliquez-nous votre demande…" /></label><Button type="submit" disabled={sendMessage.isPending} className="w-full rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f]">{sendMessage.isPending ? <Loader2 className="mr-2 animate-spin" size={17} /> : <Send className="mr-2" size={17} />}{sendMessage.isPending ? "Envoi en cours…" : "Envoyer le message"}</Button></form></Card></div></section><Footer /></div>;
}
