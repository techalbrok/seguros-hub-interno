
import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductListProps {
  isLoading: boolean;
  filteredProducts: Product[];
  viewType: 'grid' | 'list';
  searchTerm: string;
  selectedCategory: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}

export const ProductList = ({
  isLoading,
  filteredProducts,
  viewType,
  searchTerm,
  selectedCategory,
  onEdit,
  onDelete,
  onView
}: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm || selectedCategory !== 'all' ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No hay productos disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
        />
      ))}
    </div>
  );
};
