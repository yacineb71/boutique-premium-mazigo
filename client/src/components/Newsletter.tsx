import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="border-y border-[#4a3d35] bg-[#2a2421] px-4 py-14 text-[#f8f5ef] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mazigho-eyebrow mb-3 text-[#e7a17f]">L’ESPRIT MAZIGHO</p>
          <h2 className="font-display text-3xl sm:text-4xl">De l’inspiration, simplement.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#cfc2b7]">Recevez nos nouvelles sélections, nos idées cadeaux et nos offres du moment directement dans votre boîte mail.</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Votre adresse email</label>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#65554a] bg-[#211e1b] px-5 py-3">
              <Mail size={17} className="shrink-0 text-[#d77956]" />
              <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Votre adresse email…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#a99c91]" />
            </div>
            <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-full bg-[#c56f4b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a95538] disabled:opacity-60">{isLoading ? "Inscription…" : "S’inscrire"}<ArrowRight size={15} className="ml-2" /></button>
          </form>
          {submitted && <p className="mt-3 text-sm text-[#e7a17f]" role="status">Merci, votre inscription a bien été prise en compte.</p>}
          <p className="mt-3 text-xs text-[#9f9186]">Pas de bruit inutile. Seulement les trouvailles qui valent le détour.</p>
        </div>
      </div>
    </section>
  );
}
