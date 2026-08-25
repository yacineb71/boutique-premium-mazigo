import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, CircleDashed, FileText, FolderOpen, Languages, Search, Settings2, Truck } from "lucide-react";

type AdminWorkspaceProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof FileText;
  actions: ReadonlyArray<{ label: string; description: string; status?: "ready" | "empty" }>;
};

export function AdminWorkspace({ eyebrow, title, description, icon: Icon, actions }: AdminWorkspaceProps) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] to-[#f4e9df] p-6 sm:p-8">
          <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f1e9df] text-[#b65f3f]"><Icon size={24} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">{eyebrow}</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-[#211e1b]">{title}</h2><p className="mt-3 max-w-2xl text-[#6d6259]">{description}</p></div></div>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          {actions.map((action) => { const ready = action.status === "ready"; return <Card key={action.label} className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-[#211e1b]">{action.label}</h3><p className="mt-2 text-sm leading-6 text-[#6d6259]">{action.description}</p></div>{ready ? <CheckCircle2 className="shrink-0 text-[#41a46d]" size={21} /> : <CircleDashed className="shrink-0 text-[#d9a078]" size={21} />}</div><div className="mt-5 flex items-center justify-between border-t border-[#eee5dc] pt-4"><span className={`text-xs font-semibold uppercase tracking-[0.14em] ${ready ? "text-[#41a46d]" : "text-[#8b8178]"}`}>{ready ? "Prêt à configurer" : "En attente de données"}</span><ArrowRight size={16} className="text-[#b65f3f]" /></div></Card>; })}
        </section>
        <Card className="rounded-[1.25rem] border-[#eadfd4] bg-[#f8f5ef] p-5 sm:p-6"><div className="flex items-start gap-3"><Settings2 className="mt-0.5 shrink-0 text-[#b65f3f]" size={20} /><div><h3 className="font-semibold text-[#211e1b]">Espace de configuration sécurisé</h3><p className="mt-1 text-sm leading-6 text-[#6d6259]">Cette rubrique reste privée et ne modifie pas la vitrine tant qu’une action n’a pas été confirmée par l’administrateur.</p></div></div></Card>
      </div>
    </AdminLayout>
  );
}

export const workspacePresets = {
  collections: { eyebrow: "Catalogue", title: "Collections créatives", description: "Organisez les sélections éditoriales qui donnent du rythme au catalogue.", icon: FolderOpen, actions: [{ label: "Collections visibles", description: "Aucune collection éditoriale enregistrée pour le moment.", status: "empty" as const }, { label: "Ordre de mise en avant", description: "Définissez la hiérarchie des sélections lorsqu’elles seront créées.", status: "empty" as const }] },
  translations: { eyebrow: "Catalogue", title: "Langues & traductions", description: "Contrôlez la disponibilité des contenus de la boutique dans chaque langue.", icon: Languages, actions: [{ label: "Français", description: "Langue principale du catalogue.", status: "ready" as const }, { label: "Autres langues", description: "Aucune traduction supplémentaire n’est configurée.", status: "empty" as const }] },
  suppliers: { eyebrow: "Préparation", title: "Hub fournisseurs", description: "Préparez les sources fournisseurs avant toute importation dans le catalogue.", icon: Truck, actions: [{ label: "Fournisseurs connectés", description: "Aucun fournisseur externe n’est connecté.", status: "empty" as const }, { label: "Contrôle d’importation", description: "Les imports seront vérifiés avant publication.", status: "ready" as const }] },
  supplierImport: { eyebrow: "Préparation", title: "Importer fournisseur", description: "Préparez une fiche produit depuis une source fournisseur, avec vérification avant enregistrement.", icon: Truck, actions: [{ label: "Source à importer", description: "Ajoutez une URL fournisseur pour commencer un brouillon.", status: "empty" as const }, { label: "Règles de contrôle", description: "Images, prix, stock et catégorie doivent être vérifiés.", status: "ready" as const }] },
  content: { eyebrow: "Relation & contenu", title: "Contenu de la boutique", description: "Centralisez les textes éditoriaux visibles dans les pages publiques.", icon: FileText, actions: [{ label: "Pages éditoriales", description: "Les pages Accueil, À propos et Contact sont gérées depuis leur contenu dédié.", status: "ready" as const }, { label: "Blocs promotionnels", description: "Aucun bloc promotionnel supplémentaire n’est configuré.", status: "empty" as const }] },
  seo: { eyebrow: "Configuration", title: "SEO & indexation", description: "Préparez les éléments qui aident les moteurs de recherche à comprendre la boutique.", icon: Search, actions: [{ label: "Métadonnées générales", description: "Le titre et la description de la boutique utilisent les valeurs MAZIGHO actuelles.", status: "ready" as const }, { label: "Sitemap & indexation", description: "Aucun réglage avancé n’est enregistré.", status: "empty" as const }] },
  legal: { eyebrow: "Configuration", title: "Informations légales", description: "Conservez les informations nécessaires à une boutique claire et transparente.", icon: FileText, actions: [{ label: "Mentions légales", description: "Aucun contenu légal personnalisé n’est enregistré.", status: "empty" as const }, { label: "Livraison & retours", description: "Les conditions doivent être renseignées avant publication.", status: "empty" as const }] },
} as const;
