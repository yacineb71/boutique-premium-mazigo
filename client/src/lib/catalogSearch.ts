export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function matchesCatalogSearch(value: string, searchTerm: string): boolean {
  const normalizedTerm = normalizeSearchText(searchTerm);
  return normalizedTerm.length === 0 || normalizeSearchText(value).includes(normalizedTerm);
}

export type CatalogSort = "relevance" | "price-asc" | "price-desc" | "popular";

export interface SortableCatalogProduct {
  id?: number;
  price: number;
  rating: number;
  reviews: number;
}

function getQuery(location: string): URLSearchParams {
  const query = location.split("?", 2)[1]?.split("#", 1)[0] ?? "";
  return new URLSearchParams(query);
}

export function getSearchParam(location: string): string {
  return getQuery(location).get("search") ?? "";
}

export function getCatalogSortParam(location: string): CatalogSort {
  const sort = getQuery(location).get("sort");
  return sort === "price-asc" || sort === "price-desc" || sort === "popular" ? sort : "relevance";
}

export function sortCatalogProducts<T extends SortableCatalogProduct>(products: readonly T[], sort: CatalogSort): T[] {
  const sorted = [...products];

  if (sort === "price-asc") {
    return sorted.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    return sorted.sort((a, b) => b.price - a.price);
  }

  if (sort === "popular") {
    return sorted.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating || a.price - b.price);
  }

  return sorted;
}

export function buildCatalogRoute({
  searchTerm = "",
  category,
  sort = "relevance",
}: {
  searchTerm?: string;
  category?: string | null;
  sort?: CatalogSort;
}): string {
  const params: string[] = [];
  const query = searchTerm.trim();
  if (query) params.push(`search=${encodeURIComponent(query)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (sort !== "relevance") params.push(`sort=${encodeURIComponent(sort)}`);
  return params.length ? `/shop?${params.join("&")}` : "/shop";
}

export function buildCatalogSearchRoute(searchTerm: string): string {
  return buildCatalogRoute({ searchTerm });
}
