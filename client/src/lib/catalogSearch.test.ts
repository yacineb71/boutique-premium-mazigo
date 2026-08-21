import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NavigationLoaderView, NAVIGATION_LOADER_DURATION_MS, shouldShowNavigationLoader } from "@/components/NavigationLoader";
import { buildCatalogSearchRoute, getSearchParam, matchesCatalogSearch, normalizeSearchText } from "./catalogSearch";

describe("catalog search", () => {
  it("normalizes accents, casing and surrounding spaces", () => {
    expect(normalizeSearchText("  Crème Hydratante  ")).toBe("creme hydratante");
  });

  it("matches product or category text without requiring exact casing", () => {
    expect(matchesCatalogSearch("Crème Hydratante Luxe Cosmétiques", "cosmetiques")).toBe(true);
    expect(matchesCatalogSearch("Sac à Main Élégant Accessoires", "jouets")).toBe(false);
  });

  it("accepts an empty query as a match-all search", () => {
    expect(matchesCatalogSearch("T-Shirt Premium", "   ")).toBe(true);
  });

  it("reads the search query from a route location", () => {
    expect(getSearchParam("/shop?search=cr%C3%A8me%20luxe")).toBe("crème luxe");
    expect(getSearchParam("/shop")).toBe("");
  });

  it("builds the route used by Home to filter Shop", () => {
    const route = buildCatalogSearchRoute("  crème luxe ");
    expect(route).toBe("/shop?search=cr%C3%A8me%20luxe");
    expect(getSearchParam(route)).toBe("crème luxe");
  });

  it("renders the loader only while a route transition is active", () => {
    expect(renderToStaticMarkup(createElement(NavigationLoaderView, { visible: false }))).toBe("");
    expect(renderToStaticMarkup(createElement(NavigationLoaderView, { visible: true }))).toContain("Chargement");
    expect(shouldShowNavigationLoader("/", "/shop")).toBe(true);
    expect(shouldShowNavigationLoader("/shop", "/shop")).toBe(false);
  });

  it("uses a short, explicit duration for navigation feedback", () => {
    expect(NAVIGATION_LOADER_DURATION_MS).toBeGreaterThan(0);
    expect(NAVIGATION_LOADER_DURATION_MS).toBeLessThanOrEqual(500);
  });
});
