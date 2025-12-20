import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, X, Search } from "lucide-react";
import { Category } from "@/data/mockData";
import { FilterOptions } from "@/hooks/useProductFilter";

interface ProductFilterProps {
  categories: Category[];
  filters: FilterOptions;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
  onSortChange: (sort: FilterOptions["sortBy"]) => void;
  onReset: () => void;
  maxPrice: number;
  minPrice: number;
  resultCount: number;
}

export default function ProductFilter({
  categories,
  filters,
  onSearchChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onReset,
  maxPrice,
  minPrice,
  resultCount,
}: ProductFilterProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    search: true,
    category: true,
    price: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.categoryId ||
    filters.minPrice > minPrice ||
    filters.maxPrice < maxPrice ||
    filters.sortBy !== "newest";

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("search")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recherche
            </CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                expandedSections.search ? "" : "-rotate-90"
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.search && (
          <CardContent className="space-y-4">
            <Input
              placeholder="Rechercher des produits..."
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </CardContent>
        )}
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("category")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Catégories</CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                expandedSections.category ? "" : "-rotate-90"
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.category && (
          <CardContent className="space-y-3">
            <Button
              variant={filters.categoryId === null ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onCategoryChange(null)}
            >
              Toutes les catégories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  filters.categoryId === category.id ? "default" : "outline"
                }
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </Button>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Price Filter */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("price")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Prix</CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                expandedSections.price ? "" : "-rotate-90"
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.price && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-price">Prix minimum: {filters.minPrice}€</Label>
              <Input
                id="min-price"
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Prix maximum: {filters.maxPrice}€</Label>
              <Input
                id="max-price"
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Plage: {filters.minPrice}€ - {filters.maxPrice}€
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("sort")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tri</CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                expandedSections.sort ? "" : "-rotate-90"
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.sort && (
          <CardContent className="space-y-2">
            {[
              { value: "newest" as const, label: "Plus récents" },
              { value: "name" as const, label: "Nom (A-Z)" },
              { value: "price-asc" as const, label: "Prix (croissant)" },
              { value: "price-desc" as const, label: "Prix (décroissant)" },
              { value: "rating" as const, label: "Meilleures notes" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Results and Reset */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {resultCount} produit{resultCount !== 1 ? "s" : ""} trouvé{resultCount !== 1 ? "s" : ""}
        </p>
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onReset}
          >
            <X className="h-4 w-4" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
}
