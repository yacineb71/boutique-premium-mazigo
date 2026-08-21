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

export function getSearchParam(location: string): string {
  const query = location.split("?", 2)[1] ?? "";
  return new URLSearchParams(query).get("search") ?? "";
}

export function buildCatalogSearchRoute(searchTerm: string): string {
  const query = searchTerm.trim();
  return query ? `/shop?search=${encodeURIComponent(query)}` : "/shop";
}
