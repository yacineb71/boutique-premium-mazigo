import { describe, expect, it } from "vitest";
import { isAdminRouteActive, menuSections } from "@/components/AdminLayout";

describe("admin navigation", () => {
  it("active exactement le tableau de bord sur /admin", () => {
    expect(isAdminRouteActive("/admin", "/admin")).toBe(true);
    expect(isAdminRouteActive("/admin/products", "/admin")).toBe(false);
  });

  it("expose les rubriques dédiées du back-office", () => {
    const hrefs = menuSections.flatMap((section) => section.items.map((item) => item.href));
    expect(hrefs).toEqual(expect.arrayContaining([
      "/admin/messages",
      "/admin/collections",
      "/admin/translations",
      "/admin/suppliers",
      "/admin/suppliers/import",
      "/admin/content",
      "/admin/seo",
      "/admin/legal",
    ]));
  });

  it("active une rubrique et ses sous-routes", () => {
    expect(isAdminRouteActive("/admin/products", "/admin/products")).toBe(true);
    expect(isAdminRouteActive("/admin/products/new", "/admin/products")).toBe(true);
    expect(isAdminRouteActive("/admin/orders", "/admin/products")).toBe(false);
  });
});
