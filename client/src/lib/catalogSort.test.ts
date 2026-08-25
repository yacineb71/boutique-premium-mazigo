import { describe, expect, it } from "vitest";
import {
  buildCatalogRoute,
  getCatalogSortParam,
  sortCatalogProducts,
  type SortableCatalogProduct,
} from "./catalogSearch";

const products: SortableCatalogProduct[] = [
  { id: 1, price: 29.99, popularityRank: 2 },
  { id: 2, price: 49.99, popularityRank: 4 },
  { id: 3, price: 89.99, popularityRank: 1 },
  { id: 4, price: 19.99, popularityRank: 4 },
];

describe("catalog sorting", () => {
  it("sorts products from the lowest to the highest price without mutating the source", () => {
    const sorted = sortCatalogProducts(products, "price-asc");

    expect(sorted.map((product) => product.id)).toEqual([4, 1, 2, 3]);
    expect(products.map((product) => product.id)).toEqual([1, 2, 3, 4]);
  });

  it("sorts products from the highest to the lowest price", () => {
    expect(sortCatalogProducts(products, "price-desc").map((product) => product.id)).toEqual([3, 2, 1, 4]);
  });

  it("sorts popularity by internal merchandising rank, then price", () => {
    expect(sortCatalogProducts(products, "popular").map((product) => product.id)).toEqual([4, 2, 1, 3]);
  });

  it("keeps the original catalog order for relevance", () => {
    expect(sortCatalogProducts(products, "relevance").map((product) => product.id)).toEqual([1, 2, 3, 4]);
  });

  it("reads supported sort values from the URL and falls back to relevance", () => {
    expect(getCatalogSortParam("/shop?search=robe&sort=price-desc")).toBe("price-desc");
    expect(getCatalogSortParam("/shop?sort=unknown")).toBe("relevance");
  });

  it("builds a route preserving search, category and sort together", () => {
    expect(
      buildCatalogRoute({
        searchTerm: " robe soirée ",
        category: "Vêtements",
        sort: "popular",
      }),
    ).toBe("/shop?search=robe%20soir%C3%A9e&category=V%C3%AAtements&sort=popular");
  });
});
