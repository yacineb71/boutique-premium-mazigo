import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2, X } from "lucide-react";

type Category = { id: number; name: string; products: number; status: "Actif" | "Inactif" };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Vêtements", products: 12, status: "Actif" },
    { id: 2, name: "Cosmétiques", products: 4, status: "Actif" },
    { id: 3, name: "Accessoires", products: 4, status: "Actif" },
    { id: 4, name: "Cadeaux", products: 1, status: "Actif" },
    { id: 5, name: "Jouets", products: 1, status: "Actif" },
  ]);
  const [editor, setEditor] = useState<{ id: number | null; name: string }>({ id: null, name: "" });

  const saveCategory = () => {
    const name = editor.name.trim();
    if (!name) return;
    if (editor.id === null) setCategories((items) => [...items, { id: Date.now(), name, products: 0, status: "Actif" }]);
    else setCategories((items) => items.map((item) => item.id === editor.id ? { ...item, name } : item));
    setEditor({ id: null, name: "" });
  };

  return <AdminLayout><div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-display text-3xl font-semibold text-[#211e1b] sm:text-4xl">Gestion des catégories</h1><p className="mt-2 text-[#6d6259]">Organisez les univers visibles dans la boutique.</p></div><Button type="button" onClick={() => setEditor({ id: null, name: "" })} className="w-full gap-2 rounded-full bg-[#211e1b] text-white hover:bg-[#3a332f] sm:w-auto"><Plus size={20} />Ajouter une catégorie</Button></div>{editor.id === null && editor.name === "" ? null : <Card className="border-[#e5dbd0] bg-[#fffdf9] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-semibold text-[#514942]">Nom de la catégorie<input autoFocus value={editor.name} onChange={(event) => setEditor((current) => ({ ...current, name: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") saveCategory(); }} className="mt-2 h-11 w-full rounded-xl border border-[#d5cec4] bg-[#fffdf9] px-3 font-normal text-[#211e1b] outline-none focus:border-[#b65f3f]" placeholder="Ex. Maison" /></label><div className="flex gap-2"><Button type="button" onClick={saveCategory} className="rounded-full bg-[#b65f3f] text-white hover:bg-[#964b32]">Enregistrer</Button><Button type="button" variant="outline" onClick={() => setEditor({ id: null, name: "" })} className="rounded-full"><X size={16} /></Button></div></div></Card>}<Card className="border-[#e5dbd0] bg-[#fffdf9] p-6"><div className="overflow-x-auto"><table className="w-full min-w-[620px]"><thead className="border-b border-[#eee5dc] bg-[#f8f5ef]"><tr>{["Nom", "Produits", "Statut", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8178]">{heading}</th>)}</tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-b border-[#eee5dc] hover:bg-[#fbf5eb]"><td className="px-4 py-4 text-sm font-semibold text-[#211e1b]">{category.name}</td><td className="px-4 py-4 text-sm text-[#6d6259]">{category.products}</td><td className="px-4 py-4"><span className="rounded-full bg-[#edf8f1] px-3 py-1 text-xs font-semibold text-[#276749]">{category.status}</span></td><td className="flex gap-2 px-4 py-4"><button type="button" aria-label={`Modifier ${category.name}`} onClick={() => setEditor({ id: category.id, name: category.name })} className="rounded-lg p-2 text-[#b65f3f] hover:bg-[#f4dfd3]"><Edit2 size={16} /></button><button type="button" aria-label={`Supprimer ${category.name}`} onClick={() => setCategories((items) => items.filter((item) => item.id !== category.id))} className="rounded-lg p-2 text-[#9b3d27] hover:bg-[#fff1ed]"><Trash2 size={16} /></button></td></tr>)}</tbody></table></div></Card></div></AdminLayout>;
}
