import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
  showCategories?: boolean;
  maxItems?: number;
}

export default function FAQSection({
  title = "Questions Fréquemment Posées",
  description = "Trouvez les réponses à vos questions les plus courantes",
  items,
  showCategories = true,
  maxItems,
}: FAQSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Récupérer les catégories uniques
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // Filtrer les items
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  // Limiter le nombre d'items si spécifié
  const displayedItems = maxItems ? filteredItems.slice(0, maxItems) : filteredItems;

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Categories Filter */}
        {showCategories && categories.length > 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              Tous
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {displayedItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {item.question}
                  </h3>
                  {showCategories && (
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    expandedId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <CardContent className="px-6 pb-6 pt-0 border-t">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {displayedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucune question trouvée pour cette catégorie.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
