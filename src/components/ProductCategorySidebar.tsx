
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory, Product } from "@/types";

interface NavCategoryNodeProps {
  category: ProductCategory;
  allCategories: ProductCategory[];
  level: number;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  productCounts: Record<string, number>;
}

const NavCategoryNode = ({ category, allCategories, level, selectedCategory, onSelectCategory, productCounts }: NavCategoryNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const children = allCategories.filter(c => c.parentId === category.id);
  const hasChildren = children.length > 0;
  const count = productCounts[category.id] || 0;

  const isActive = selectedCategory === category.id;

  if (count === 0 && children.length === 0) {
    return null;
  }

  return (
    <div className="pl-4">
      <div
        className={cn(
          "flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer",
          "hover:bg-muted/50 transition-colors",
          isActive && "bg-muted text-primary font-medium"
        )}
        onClick={() => onSelectCategory(category.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0 h-6 w-6"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <span className="font-medium text-sm truncate">{category.name}</span>
        </div>
        <span className="text-sm text-muted-foreground ml-2">{count}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {children.map((child) => (
            <NavCategoryNode
              key={child.id}
              category={child}
              allCategories={allCategories}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              productCounts={productCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
};


interface ProductCategorySidebarProps {
    categories: ProductCategory[];
    products: Product[];
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
}

export const ProductCategorySidebar = ({ categories, products, selectedCategory, onSelectCategory }: ProductCategorySidebarProps) => {
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    categories.forEach(c => counts[c.id] = 0);

    products.forEach(product => {
        if (product.categoryId && categoryMap.has(product.categoryId)) {
            let currentCatId: string | undefined = product.categoryId;
            while(currentCatId) {
                if (counts[currentCatId] !== undefined) {
                    counts[currentCatId]++;
                }
                currentCatId = categoryMap.get(currentCatId)?.parentId;
            }
        }
    });
    
    counts["all"] = products.length;
    return counts;
  }, [categories, products]);
  
  const rootCategories = categories.filter(cat => !cat.parentId);

  return (
    <Card className="w-full lg:w-72 lg:flex-shrink-0">
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold px-2 mb-2">Categorías</h3>
        <div
            className={cn(
              "flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer",
              "hover:bg-muted/50 transition-colors",
              selectedCategory === "all" && "bg-muted text-primary font-medium"
            )}
            onClick={() => onSelectCategory("all")}
        >
            <span className="font-medium text-sm">Todas las categorías</span>
            <span className="text-sm text-muted-foreground">{productCounts["all"] || 0}</span>
        </div>
        {rootCategories.map((category) => (
          <NavCategoryNode
            key={category.id}
            category={category}
            allCategories={categories}
            level={1}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            productCounts={productCounts}
          />
        ))}
      </CardContent>
    </Card>
  );
};

