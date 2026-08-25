import React, { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const subscribe = trpc.contact.subscribe.useMutation({
    onSuccess: (result) => {
      setFeedback({ type: result.success ? "success" : "error", message: result.message });
      if (result.success) setEmail("");
    },
    onError: (error) => setFeedback({ type: "error", message: error.message || "Réessayez plus tard." }),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    subscribe.mutate({ email });
  };

  return <section className="border-y border-[#4a3d35] bg-[#2a2421] px-4 py-14 text-[#f8f5ef] sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_1.2fr]"><div><p className="mazigho-eyebrow mb-3 text-[#e7a17f]">L’ESPRIT MAZIGHO</p><h2 className="font-display text-3xl sm:text-4xl">De l’inspiration, simplement.</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#cfc2b7]">Recevez nos nouvelles sélections, nos idées cadeaux et nos offres du moment directement dans votre boîte mail.</p></div><div><form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row"><label htmlFor="newsletter-email" className="sr-only">Votre adresse email</label><div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#65554a] bg-[#211e1b] px-5 py-3"><Mail size={17} className="shrink-0 text-[#d77956]" /><input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setFeedback(null); }} required placeholder="Votre adresse email…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#a99c91]" /></div><button type="submit" disabled={subscribe.isPending} className="inline-flex items-center justify-center rounded-full bg-[#c56f4b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a95538] disabled:opacity-60">{subscribe.isPending ? <Loader2 className="mr-2 animate-spin" size={15} /> : null}{subscribe.isPending ? "Inscription…" : "S’inscrire"}{!subscribe.isPending ? <ArrowRight size={15} className="ml-2" /> : null}</button></form>{feedback ? <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-[#bce6c9]" : "text-[#f3b3a3]"}`} role="status">{feedback.message}</p> : null}<p className="mt-3 text-xs text-[#9f9186]">Pas de bruit inutile. Seulement les trouvailles qui valent le détour.</p></div></div></section>;
}
