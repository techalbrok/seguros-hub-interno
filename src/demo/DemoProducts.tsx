
import { useState, useEffect } from "react";
import type { Product, ProductCategory } from "@/types";
import { ProductControls } from "@/components/products/ProductControls";
import { ProductList } from "@/components/products/ProductList";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCategorySidebar } from "@/components/ProductCategorySidebar";
import { DemoProductForm } from "./DemoProductForm";
import { ProductDetail } from "@/components/ProductDetail";
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
import { Card, CardContent } from "@/components/ui/card";

const DEMO_PRODUCTS_KEY = "demo_products_list";

const demoCategories: ProductCategory[] = [
  { id: 'cat1', name: 'Seguros de Coche', parentId: null, level: 1, documents: [] },
  { id: 'cat2', name: 'Seguros de Hogar', parentId: null, level: 1, documents: [] },
  { id: 'cat3', name: 'Seguros de Vida', parentId: null, level: 1, documents: [] },
];

interface DemoCompany { id: string; name: string; }
const demoCompanies: DemoCompany[] = [
    { id: 'comp1', name: 'Aseguradora Líder' },
    { id: 'comp2', name: 'Protección Global Seguros' }
];

const demoDefaultProducts: Product[] = [
  { 
    id: "1", 
    title: "Seguro de Coche 'Todo Riesgo Premium'",
    process: "Contratación 100% online con peritaje por IA. Gestión de siniestros y coche de sustitución en 24h.",
    strengths: "Cobertura total contra todo daño, robo e incendio. Asistencia en viaje ilimitada y defensa jurídica.",
    observations: "Recomendado para vehículos nuevos de gama alta. Descuento del 15% con más de 10 años de carnet.",
    categoryId: "cat1",
    companyId: "comp1",
    documents: [],
    createdAt: new Date('2025-05-10T10:00:00Z'),
    updatedAt: new Date('2025-06-12T15:30:00Z'),
  },
  { 
    id: "2", 
    title: "Seguro de Hogar 'Protección Total Plus'",
    process: "Contratación telefónica con asesor personal. Incluye una revisión anual de la instalación eléctrica y de gas.",
    strengths: "Cubre daños por agua, fuego, robo y fenómenos meteorológicos. Incluye servicio de manitas y reparación de electrodomésticos.",
    observations: "Cobertura de joyas hasta 6.000€. Posibilidad de incluir seguro para mascotas.",
    categoryId: "cat2",
    companyId: "comp2",
    documents: [],
    createdAt: new Date('2025-04-20T09:00:00Z'),
    updatedAt: new Date('2025-06-10T11:00:00Z'),
  },
  { 
    id: "3", 
    title: "Seguro de Vida 'Tranquilidad Familiar'",
    process: "Estudio y contratación en nuestras oficinas. Acceso a segunda opinión médica internacional.",
    strengths: "Capital por fallecimiento e invalidez permanente. Anticipo de capital para enfermedades graves.",
    observations: "Sin necesidad de reconocimiento médico para capitales inferiores a 200.000€.",
    categoryId: "cat3",
    companyId: "comp1",
    documents: [],
    createdAt: new Date('2025-03-15T12:00:00Z'),
    updatedAt: new Date('2025-06-01T18:45:00Z'),
  },
  {
    id: "4", 
    title: "Seguro de Coche a Terceros Ampliado",
    process: "Contratación rápida a través de la app. Verificación de documentos automática.",
    strengths: "Cubre lunas, robo e incendio. Grúa desde el km 0. Libre elección de taller.",
    observations: "Ideal para vehículos de más de 5 años. Bonificación de hasta el 60%.",
    categoryId: "cat1",
    companyId: "comp2",
    documents: [],
    createdAt: new Date('2025-02-01T16:00:00Z'),
    updatedAt: new Date('2025-05-25T08:20:00Z'),
  },
];


export const DemoProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState("products");
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
      const initialProducts = stored 
        ? JSON.parse(stored).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }))
        : demoDefaultProducts;
      setProducts(initialProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

  const getDescendantCategoryIds = (parentId: string): string[] => {
    const descendants: string[] = [];
    const children = demoCategories.filter(cat => cat.parentId === parentId);
    for (const child of children) {
      descendants.push(child.id);
      descendants.push(...getDescendantCategoryIds(child.id));
    }
    return descendants;
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.process || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.strengths || '').toLowerCase().includes(searchTerm.toLowerCase());
  
    if (selectedCategory === "all") {
      return searchMatch;
    }
  
    const categoryIdsToFilter = [selectedCategory, ...getDescendantCategoryIds(selectedCategory)];
    const categoryMatch = product.categoryId ? categoryIdsToFilter.includes(product.categoryId) : false;
    
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
      setProducts(p => p.filter(pr => pr.id !== productToDelete.id));
      if (selectedProduct?.id === productToDelete.id) {
        setSelectedProduct(null);
        setShowDetail(false);
      }
      setProductToDelete(null);
    }
  };

  const handleSubmit = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'documents'>) => {
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, ...data, updatedAt: new Date() };
      setProducts(p => p.map(pr => pr.id === selectedProduct.id ? updatedProduct : pr));
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).slice(2),
        ...data,
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts(p => [newProduct, ...p]);
    }
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <ProductCategorySidebar
              categories={demoCategories}
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="flex-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <ProductControls
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    viewType={viewType}
                    onViewTypeChange={setViewType}
                    onAddNew={handleAddNew}
                  />
                </CardContent>
              </Card>

              <ProductList
                isLoading={isLoading}
                filteredProducts={filteredProducts}
                viewType={viewType}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                categories={demoCategories}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              La gestión de categorías no está disponible en el modo de demostración.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DemoProductForm
        open={showForm}
        onOpenChange={setShowForm}
        product={selectedProduct || undefined}
        onSubmit={handleSubmit}
        categories={demoCategories}
        companies={demoCompanies}
      />

      <ProductDetail
        open={showDetail}
        onOpenChange={setShowDetail}
        product={selectedProduct}
        onEdit={handleEdit}
      />

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto{' '}
              <span className="font-semibold">{productToDelete?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className={buttonVariants({ variant: "destructive" })}
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
