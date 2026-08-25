import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, ImagePlus, Link as LinkIcon, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function AdminMedia() {
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();
  const media = trpc.content.media.list.useQuery();
  const addUrl = trpc.content.media.addUrl.useMutation({ onSuccess: () => { setUrl(""); setAltText(""); utils.content.media.list.invalidate(); } });
  const upload = trpc.content.media.upload.useMutation({ onSuccess: () => { utils.content.media.list.invalidate(); } });
  const remove = trpc.content.media.remove.useMutation({ onSuccess: () => utils.content.media.list.invalidate() });

  const handleFile = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = reject; reader.readAsDataURL(file); });
    upload.mutate({ filename: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif", base64, altText: file.name });
  };

  return <AdminLayout>
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl text-[#211e1b]">Médiathèque</h1><p className="mt-2 text-[#6d6259]">Ajoutez, prévisualisez et réutilisez les images de votre boutique.</p></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-5"><div className="mb-4 flex items-center gap-2 font-semibold"><LinkIcon size={18} className="text-[#b65f3f]" /> Ajouter par URL</div><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mb-3 w-full rounded-xl border border-[#d5cec4] bg-white px-3 py-2" /><input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Texte alternatif" className="mb-4 w-full rounded-xl border border-[#d5cec4] bg-white px-3 py-2" /><Button disabled={!url || addUrl.isPending} onClick={() => addUrl.mutate({ url, altText })} className="rounded-full bg-[#211e1b]">Ajouter l’image</Button></Card>
        <Card className="rounded-3xl border-[#ded5ca] bg-[#fbf9f5] p-5"><div className="mb-4 flex items-center gap-2 font-semibold"><Upload size={18} className="text-[#b65f3f]" /> Télécharger un fichier</div><p className="mb-4 text-sm text-[#6d6259]">JPEG, PNG, WebP ou AVIF. Les fichiers sont stockés hors du projet.</p><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => handleFile(e.target.files?.[0])} /><Button disabled={upload.isPending} onClick={() => fileRef.current?.click()} className="rounded-full bg-[#b65f3f]">{upload.isPending ? "Téléchargement…" : "Choisir une image"}</Button></Card>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{(media.data ?? []).map((item) => <Card key={item.id} className="group overflow-hidden rounded-2xl border-[#ded5ca] bg-[#fbf9f5]"><div className="aspect-square bg-[#eee8df]"><img src={item.url} alt={item.altText ?? item.filename ?? "Image média"} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div><div className="p-3"><p className="truncate text-xs text-[#6d6259]">{item.filename ?? item.url}</p><div className="mt-3 flex gap-2"><a href={item.url} download={item.filename ?? true} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center rounded-full border border-[#d5cec4] py-2 text-xs"><Download size={14} /></a><button onClick={() => remove.mutate({ id: item.id })} className="rounded-full border border-[#d5cec4] px-3 text-[#b65f3f]" aria-label="Supprimer"><Trash2 size={14} /></button></div></div></Card>)}</div>
      {!media.isLoading && !(media.data?.length) && <div className="rounded-2xl border border-dashed border-[#d5cec4] p-10 text-center text-[#6d6259]"><ImagePlus className="mx-auto mb-3" />Votre médiathèque est vide.</div>}
    </div>
  </AdminLayout>;
}
