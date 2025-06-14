
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2, FileText, Plus } from "lucide-react";
import type { ProductCategory } from "@/types";

interface CategoryTreeProps {
  categories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: (parentId: string) => void;
}

interface CategoryNodeProps {
  category: ProductCategory;
  children: ProductCategory[];
  level: number;
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: (parentId: string) => void;
}

const CategoryNode = ({ category, children, level, onEdit, onDelete, onAddSubcategory }: CategoryNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level <= 2);

  const hasChildren = children.length > 0;

  return (
    <div className="ml-4">
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary">Nivel {category.level}</Badge>
                {category.documents && category.documents.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    {category.documents.length}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSubcategory(category.id)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Subcategoría
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(category.id)}
                className="flex items-center gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasChildren && isExpanded && (
        <div className="ml-4">
          {children.map((child) => {
            const grandChildren = children.filter(c => c.parentId === child.id);
            return (
              <CategoryNode
                key={child.id}
                category={child}
                children={grandChildren}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubcategory={onAddSubcategory}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CategoryTree = ({ categories, onEdit, onDelete, onAddSubcategory }: CategoryTreeProps) => {
  // Build hierarchical structure
  const rootCategories = categories.filter(cat => !cat.parentId);
  
  const buildTree = (parentId?: string): ProductCategory[] => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  return (
    <div className="space-y-4">
      {rootCategories.map((category) => {
        const children = buildTree(category.id);
        return (
          <CategoryNode
            key={category.id}
            category={category}
            children={children}
            level={1}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubcategory={onAddSubcategory}
          />
        );
      })}
    </div>
  );
};
