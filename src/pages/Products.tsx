
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Grid, List } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { ProductDetail } from "@/components/ProductDetail";
import { CategoryManagement } from "@/components/CategoryManagement";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import { useProductCategories } from "@/hooks/useProductCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating
  } = useProducts();
  const { categories: productCategories } = useProductCategories();

  const getDescendantCategoryIds = (parentId: string): string[] => {
    const descendants: string[] = [];
    const children = productCategories.filter(cat => cat.parentId === parentId);
    
    for (const child of children) {
      descendants.push(child.id);
      descendants.push(...getDescendantCategoryIds(child.id));
    }
    
    return descendants;
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.process && product.process.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.strengths && product.strengths.toLowerCase().includes(searchTerm.toLowerCase()));
  
    if (selectedCategory === "all") {
      return searchMatch;
    }
  
    if (!product.categoryId) {
      return false;
    }
  
    const categoryIdsToFilter = [selectedCategory, ...getDescendantCategoryIds(selectedCategory)];
    const categoryMatch = categoryIdsToFilter.includes(product.categoryId);
    
    return searchMatch && categoryMatch;
  });
  
  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };
  
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(false);
    setShowForm(true);
  };
  
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(id);
    }
  };
  
  const handleSubmit = (data: any) => {
    const mutationOptions = {
      onSuccess: () => {
        setShowForm(false);
        setSelectedProduct(null);
      }
    };

    if (selectedProduct) {
      updateProduct({
        ...data,
        id: selectedProduct.id
      }, mutationOptions);
    } else {
      createProduct(data, mutationOptions);
    }
  };

  const onFormOpenChange = (isOpen: boolean) => {
    setShowForm(isOpen);
    if (!isOpen) {
      setSelectedProduct(null);
    }
  };

  const onDetailOpenChange = (isOpen: boolean) => {
    setShowDetail(isOpen);
    if (!isOpen) {
      setSelectedProduct(null);
    }
  };

  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">Productos</h1>
          <p className="text-muted-foreground mt-1">
            Administra el catálogo de productos y categorías
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar productos..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-10 w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {"—".repeat(category.level > 1 ? category.level - 1 : 0)} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={viewType === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewType('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewType === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewType('list')}>
                <List className="h-4 w-4" />
              </Button>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? <div className="text-center py-12">
              <p>Cargando productos...</p>
            </div> : filteredProducts.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No hay productos disponibles.'}
              </p>
            </div> : <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />)}
            </div>}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
      
      <ProductForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        product={selectedProduct || undefined}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ProductDetail
        open={showDetail}
        onOpenChange={onDetailOpenChange}
        product={selectedProduct}
        onEdit={handleEdit}
      />
    </div>;
};
export default Products;
