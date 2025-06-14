import { useState } from 'react';
import type { Product, ProductCategory } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductListItem } from "./ProductListItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductCardSkeleton, ProductListItemSkeleton } from '../skeletons/ProductSkeletons';
import { AppPagination } from '../ui/AppPagination';

interface ProductListProps {
  isLoading: boolean;
  filteredProducts: Product[];
  viewType: "grid" | "list";
  searchTerm: string;
  selectedCategory: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  categories: ProductCategory[];
}

export const ProductList = ({
  isLoading,
  filteredProducts,
  viewType,
  searchTerm,
  selectedCategory,
  onEdit,
  onDelete,
  onView,
  categories,
}: ProductListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = viewType === 'list' ? 10 : 9;

  if (isLoading) {
    if (viewType === 'list') {
      return (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Título</TableHead>
                <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                <TableHead className="hidden md:table-cell">Proceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => <ProductListItemSkeleton key={i} />)}
            </TableBody>
          </Table>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm || selectedCategory !== "all"
            ? "No se encontraron productos que coincidan con tu búsqueda."
            : "No hay productos disponibles."}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const content = viewType === 'list' ? (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Título</TableHead>
            <TableHead className="hidden sm:table-cell">Categoría</TableHead>
            <TableHead className="hidden md:table-cell">Proceso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              categories={categories}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          categories={categories}
        />
      ))}
    </div>
  );

  return (
    <>
      {content}
      {totalPages > 1 && (
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}
    </>
  );
};
