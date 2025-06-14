import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "@/components/ProductForm";
import { ProductDetail } from "@/components/ProductDetail";
import { CategoryManagement } from "@/components/CategoryManagement";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import { useProductCategories } from "@/hooks/useProductCategories";
import { ProductCategorySidebar } from "@/components/ProductCategorySidebar";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductControls } from "@/components/products/ProductControls";
import { ProductList } from "@/components/products/ProductList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
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
  
  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setProductToDelete(product);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          if (selectedProduct?.id === productToDelete.id) {
            setSelectedProduct(null);
            setShowDetail(false);
          }
          setProductToDelete(null);
        },
        onError: () => {
          setProductToDelete(null);
        },
      });
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

  const deleteConfirmationDialog = (
    <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el producto{' '}
            <span className="font-semibold">{productToDelete?.title}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return <div className="space-y-6">
      <ProductsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <ProductCategorySidebar
              categories={productCategories}
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="flex-1 space-y-6">
              <ProductControls
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                viewType={viewType}
                onViewTypeChange={setViewType}
                onAddNew={handleAddNew}
              />

              <ProductList
                isLoading={isLoading}
                filteredProducts={filteredProducts}
                viewType={viewType}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                categories={productCategories}
              />
            </div>
          </div>
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

      {deleteConfirmationDialog}
    </div>;
};
export default Products;
