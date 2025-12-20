import { useState, useMemo } from "react";
import { Product } from "@/data/mockData";

export interface FilterOptions {
  searchQuery: string;
  categoryId: number | null;
  minPrice: number;
  maxPrice: number;
  sortBy: "name" | "price-asc" | "price-desc" | "rating" | "newest";
}

export interface UseProductFilterReturn {
  filteredProducts: Product[];
  filters: FilterOptions;
  setSearchQuery: (query: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setSortBy: (sort: FilterOptions["sortBy"]) => void;
  resetFilters: () => void;
  getMaxPrice: () => number;
  getMinPrice: () => number;
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: "",
  categoryId: null,
  minPrice: 0,
  maxPrice: 100000,
  sortBy: "newest",
};

export function useProductFilter(products: Product[]): UseProductFilterReturn {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Calculer les prix min/max des produits
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtre par recherche
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (filters.categoryId !== null) {
      result = result.filter((product) => product.categoryId === filters.categoryId);
    }

    // Filtre par prix
    result = result.filter(
      (product) => product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Tri
    switch (filters.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, filters]);

  return {
    filteredProducts,
    filters,
    setSearchQuery: (query) =>
      setFilters((prev) => ({ ...prev, searchQuery: query })),
    setCategoryId: (categoryId) =>
      setFilters((prev) => ({ ...prev, categoryId })),
    setMinPrice: (price) =>
      setFilters((prev) => ({ ...prev, minPrice: price })),
    setMaxPrice: (price) =>
      setFilters((prev) => ({ ...prev, maxPrice: price })),
    setSortBy: (sort) =>
      setFilters((prev) => ({ ...prev, sortBy: sort })),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
    getMaxPrice: () => priceRange.max,
    getMinPrice: () => priceRange.min,
  };
}
