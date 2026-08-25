import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("media gallery and product visuals", () => {
  it("keeps the admin media route private and wired", () => {
    const app = read("../App.tsx");
    const media = read("../pages/AdminMedia.tsx");
    expect(app).toContain('path="/admin/media"');
    expect(app).toContain("<AdminMedia />");
    expect(media).toContain("trpc.content.media.addUrl");
    expect(media).toContain("trpc.content.media.upload");
    expect(media).toContain("trpc.content.media.attachToProduct");
    expect(media).toContain("trpc.content.media.reorderProduct");
  });

  it("provides product carousel controls and multiple image sources", () => {
    const carousel = read("../components/ProductImageCarousel.tsx");
    const detail = read("../pages/ProductDetail.tsx");
    const media = read("../pages/AdminMedia.tsx");
    expect(carousel).toContain("Photo précédente");
    expect(carousel).toContain("Photo suivante");
    expect(detail).toContain("images: [");
    expect(media).toContain("draggable");
  });

  it("uses progressive loading hooks for category images", () => {
    const home = read("../pages/Home.tsx");
    expect(home).toContain('classList.remove("opacity-0")');
    expect(home).toContain('loading="lazy"');
  });
});
