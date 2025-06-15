
import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { ProductControls } from "@/components/products/ProductControls";
import { ProductList } from "@/components/products/ProductList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DEMO_PRODUCTS_KEY = "demo_products_list";

const demoDefaultProducts: Product[] = [
  { 
    id: "1", 
    title: "Producto Demo X",
    process: "Proceso de fabricación con materiales reciclados.",
    strengths: "Alta durabilidad y resistencia al agua.",
    observations: "Ideal para uso en exteriores.",
    categoryId: "cat1",
    companyId: "comp1",
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: "2", 
    title: "Producto Demo Y",
    process: "Ensamblaje de precisión con control de calidad.",
    strengths: "Diseño ergonómico y fácil de usar.",
    observations: "",
    categoryId: "cat2",
    companyId: "comp1",
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DemoProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

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

  const handleAddNew = () => {
    const title = prompt("Nombre del producto:");
    if (title) {
      const newProduct: Product = {
        id: Math.random().toString(36).slice(2),
        title,
        process: "Nuevo proceso añadido en la demo.",
        strengths: "Fortalezas por defecto de la demo.",
        observations: "",
        categoryId: "",
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts(p => [newProduct, ...p]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(p => p.filter(pr => pr.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    const newTitle = prompt("Nuevo nombre del producto:", product.title);
    if (newTitle) {
      setProducts(p => p.map(pr => pr.id === product.id ? { ...pr, title: newTitle, updatedAt: new Date() } : pr));
    }
  };

  const handleView = (product: Product) => {
    alert(`Viendo producto:\n\nTítulo: ${product.title}\nProceso: ${product.process}\nFortalezas: ${product.strengths}`);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.process && product.process.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos Demo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <ProductControls
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            viewType={viewType}
            onViewTypeChange={setViewType}
            onAddNew={handleAddNew}
          />
        </CardHeader>
        <CardContent>
          <ProductList
            isLoading={isLoading}
            filteredProducts={filteredProducts}
            viewType={viewType}
            searchTerm={searchTerm}
            selectedCategory="all"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            categories={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
