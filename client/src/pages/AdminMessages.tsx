import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Inbox, Mail, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function AdminMessages() {
  const [query, setQuery] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] to-[#f4e9df] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">Relation & contenu</p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-[#211e1b]">Messages</h2><p className="mt-3 max-w-2xl text-[#6d6259]">Centralisez les demandes reçues depuis la boutique et gardez une trace claire des réponses.</p></div>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#b65f3f] px-5 text-sm font-semibold text-white hover:bg-[#964b32]"><Plus size={16} /> Ouvrir le formulaire contact</Link>
          </div>
        </section>
        <Card className="overflow-hidden rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9]">
          <div className="flex flex-col gap-4 border-b border-[#eee5dc] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3"><Inbox className="text-[#b65f3f]" size={21} /><div><h3 className="text-xl font-semibold text-[#211e1b]">Boîte de réception</h3><p className="mt-1 text-sm text-[#6d6259]">Messages authentifiés et demandes du formulaire de contact.</p></div></div>
            <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={16} /><span className="sr-only">Rechercher un message</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher…" className="h-10 w-full rounded-full border border-[#d5cec4] bg-[#fffdf9] pl-9 pr-4 text-sm text-[#211e1b] outline-none focus:border-[#b65f3f]" /></label>
          </div>
          <div className="px-5 py-16 text-center sm:px-6"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e9df] text-[#b65f3f]"><Mail size={25} /></span><h3 className="mt-5 text-lg font-semibold text-[#211e1b]">{query ? "Aucun message trouvé" : "Aucun message reçu"}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6d6259]">{query ? `Aucun message ne correspond à « ${query} ».` : "Les messages apparaîtront ici dès qu’un client vous contactera depuis la boutique."}</p></div>
        </Card>
      </div>
    </AdminLayout>
  );
}
