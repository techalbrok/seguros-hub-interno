
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import { CategoryTree } from "./CategoryTree";
import { useProductCategories } from "@/hooks/useProductCategories";
import type { ProductCategory } from "@/types";

type ViewMode = 'list' | 'form';

export const CategoryManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
  } = useProductCategories();

  const handleAddNew = () => {
    setSelectedCategory(null);
    setParentCategoryId("");
    setViewMode('form');
  };

  const handleAddSubcategory = (parentId: string) => {
    setSelectedCategory(null);
    setParentCategoryId(parentId);
    setViewMode('form');
  };

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategory(category);
    setParentCategoryId("");
    setViewMode('form');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará todas sus subcategorías.')) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (data: any) => {
    const categoryData = {
      name: data.name,
      parentId: data.parentId || undefined,
      level: data.level,
    };

    const mutationCallbacks = {
      onSuccess: () => {
        setViewMode('list');
        setSelectedCategory(null);
        setParentCategoryId("");
      }
    };

    if (selectedCategory) {
      updateCategory({ ...categoryData, id: selectedCategory.id }, mutationCallbacks);
    } else {
      createCategory(categoryData, mutationCallbacks);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setParentCategoryId("");
    setViewMode('list');
  };

  if (viewMode === 'form') {
    return (
      <CategoryForm
        category={selectedCategory || undefined}
        parentCategoryId={parentCategoryId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sidebar-primary dark:text-white">
            Gestión de Categorías
          </h2>
          <p className="text-muted-foreground mt-1">
            Organiza los productos en categorías jerárquicas
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Categories Tree */}
      {isLoading ? (
        <div className="text-center py-12">
          <p>Cargando categorías...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay categorías disponibles.</p>
        </div>
      ) : (
        <CategoryTree
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddSubcategory={handleAddSubcategory}
        />
      )}
    </div>
  );
};
