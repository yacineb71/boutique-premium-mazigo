import React, { useState } from "react";

type Props = { images: string[]; alt: string };

export function ProductImageCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  const safeImages = images.filter(Boolean);
  const current = safeImages[index] ?? safeImages[0];
  const move = (delta: number) => setIndex((value) => (value + delta + safeImages.length) % safeImages.length);
  if (!current) return <div className="min-h-[28rem] rounded-[2rem] bg-[#eee8df]" />;
  return <div className="space-y-3">
    <div className="group relative flex min-h-[28rem] items-center justify-center overflow-hidden rounded-[2rem] bg-[#eee8df] p-4 sm:p-8">
      <img src={current} alt={`${alt} — photo ${index + 1}`} width="900" height="900" loading={index === 0 ? "eager" : "lazy"} decoding="async" className="h-full max-h-[34rem] w-full rounded-[1.5rem] object-cover shadow-sm transition-opacity duration-200" />
      {safeImages.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Photo précédente" className="absolute left-6 rounded-full bg-[#211e1b]/80 p-3 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100">‹</button><button type="button" onClick={() => move(1)} aria-label="Photo suivante" className="absolute right-6 rounded-full bg-[#211e1b]/80 p-3 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100">›</button></>}
    </div>
    {safeImages.length > 1 && <div className="flex gap-2 overflow-x-auto" aria-label="Galerie photos">{safeImages.map((image, itemIndex) => <button key={image} type="button" onClick={() => setIndex(itemIndex)} aria-label={`Afficher la photo ${itemIndex + 1}`} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${itemIndex === index ? "border-[#b65f3f]" : "border-transparent"}`}><img src={image} alt="" width="64" height="64" loading="lazy" className="h-full w-full object-cover" /></button>)}</div>}
  </div>;
}
