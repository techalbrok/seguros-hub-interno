
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid, List } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { ProductDetail } from "@/components/ProductDetail";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";

type ViewMode = 'list' | 'form' | 'detail';

const Products = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
  } = useProducts();

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.process && product.process.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.strengths && product.strengths.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNew = () => {
    setSelectedProduct(null);
    setViewMode('form');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('form');
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('detail');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedProduct) {
      updateProduct({ ...data, id: selectedProduct.id });
    } else {
      createProduct(data);
    }
    setViewMode('list');
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setViewMode('list');
  };

  if (viewMode === 'form') {
    return (
      <ProductForm
        product={selectedProduct}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  if (viewMode === 'detail' && selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onClose={handleCancel}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
            Gestión de Productos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra el catálogo de productos
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p>Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No hay productos disponibles.'}
          </p>
        </div>
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
