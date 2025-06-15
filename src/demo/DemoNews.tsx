
import { useState, useEffect } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { NewsCard } from "@/components/NewsCard";
import { NewsForm } from "@/components/NewsForm";
import { NewsDetail } from "@/components/NewsDetail";
import { NewsCardSkeleton } from "@/components/skeletons/NewsSkeletons";
import { Plus, Search } from 'lucide-react';

import type { News, CreateNewsData } from "@/hooks/useNews";
import type { ProductCategory, Product, Company } from "@/types";

const DEMO_NEWS_KEY = "demo_news_list";

const demoCategories: ProductCategory[] = [
  { id: 'cat1', name: 'Seguros de Coche', parentId: null, level: 1, documents: [] },
  { id: 'cat2', name: 'Seguros de Hogar', parentId: null, level: 1, documents: [] },
  { id: 'cat3', name: 'Seguros de Vida', parentId: null, level: 1, documents: [] },
];

const demoCompanies: Company[] = [
    { 
        id: 'comp1', 
        name: 'Aseguradora Líder',
        commercialWebsite: 'https://www.lider.com',
        brokerAccess: 'Acceso Corredores',
        commercialManager: 'Juan Pérez',
        managerEmail: 'juan.perez@lider.com',
        specifications: [],
        specificationCategories: [],
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2025-05-01'),
    },
    { 
        id: 'comp2', 
        name: 'Protección Global Seguros',
        commercialWebsite: 'https://www.proteccionglobal.com',
        brokerAccess: 'Portal Mediadores',
        commercialManager: 'Ana García',
        managerEmail: 'ana.garcia@proteccionglobal.com',
        specifications: [],
        specificationCategories: [],
        createdAt: new Date('2021-03-15'),
        updatedAt: new Date('2025-06-10'),
    }
];

const demoProducts: Array<{id: string; title: string;}> = [
  { id: "1", title: "Seguro de Coche 'Todo Riesgo Premium'" },
  { id: "2", title: "Seguro de Hogar 'Protección Total Plus'" },
  { id: "3", title: "Seguro de Vida 'Tranquilidad Familiar'" },
  { id: "4", title: "Seguro de Coche a Terceros Ampliado" },
];

const demoDefaultNews: News[] = [
  {
    id: "news1",
    title: "Lanzamiento del nuevo Seguro de Coche 'Premium Total'",
    content: "<p><strong>Aseguradora Líder</strong> se enorgullece en presentar su nuevo producto estrella: el seguro de coche 'Premium Total'.</p><p>Diseñado para los conductores más exigentes, ofrece coberturas nunca antes vistas en el mercado, incluyendo peritaje con drones y asistencia en viaje con vehículo de lujo de sustitución.</p>",
    featured_image: "https://images.unsplash.com/photo-1553440569-b50675239069?q=80&w=2070&auto=format&fit=crop",
    author_id: "admin-demo",
    published: true,
    published_at: new Date('2025-06-10T10:00:00Z').toISOString(),
    created_at: new Date('2025-06-10T09:00:00Z').toISOString(),
    updated_at: new Date('2025-06-10T10:00:00Z').toISOString(),
    profiles: { name: "Equipo de Marketing", email: "marketing@example.com" },
    companies: [{ id: 'comp1', name: 'Aseguradora Líder' }],
    categories: [{ id: 'cat1', name: 'Seguros de Coche' }],
    products: [{ id: '1', title: "Seguro de Coche 'Todo Riesgo Premium'" }],
  },
  {
    id: "news2",
    title: "Consejos para proteger tu hogar este verano",
    content: "<p>El verano es una época ideal para las vacaciones, pero también cuando los robos en viviendas aumentan. Desde <strong>Protección Global Seguros</strong> te ofrecemos unos sencillos consejos para que protejas tu hogar.</p><p>Recuerda revisar cerraduras, no publicar tus planes de viaje en redes sociales y considerar instalar una alarma conectada.</p>",
    featured_image: "https://images.unsplash.com/photo-1600585154340-be6164a83639?q=80&w=2070&auto=format&fit=crop",
    author_id: "admin-demo",
    published: true,
    published_at: new Date('2025-06-05T12:00:00Z').toISOString(),
    created_at: new Date('2025-06-05T11:30:00Z').toISOString(),
    updated_at: new Date('2025-06-05T12:00:00Z').toISOString(),
    profiles: { name: "Dpto. de Seguridad", email: "seguridad@example.com" },
    companies: [{ id: 'comp2', name: 'Protección Global Seguros' }],
    categories: [{ id: 'cat2', name: 'Seguros de Hogar' }],
    products: [{ id: '2', title: "Seguro de Hogar 'Protección Total Plus'" }],
  },
  {
    id: "news3",
    title: "Nuestra nueva app móvil ya está disponible",
    content: "<p>¡Grandes noticias! Hemos lanzado nuestra nueva aplicación móvil para que gestiones todos tus seguros desde la palma de tu mano. Descárgala ya en la App Store y Google Play.</p>",
    featured_image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop",
    author_id: "admin-demo",
    published: false, // This one is a draft
    published_at: undefined,
    created_at: new Date('2025-06-14T15:00:00Z').toISOString(),
    updated_at: new Date('2025-06-14T15:00:00Z').toISOString(),
    profiles: { name: "Equipo Digital", email: "digital@example.com" },
  }
];

export const DemoNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(DEMO_NEWS_KEY);
      const initialNews = stored ? JSON.parse(stored) : demoDefaultNews;
      setNews(initialNews);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DEMO_NEWS_KEY, JSON.stringify(news));
    }
  }, [news, isLoading]);

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedNews(null);
    setShowForm(true);
  };

  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setShowDetail(false);
    setShowForm(true);
  };

  const handleView = (newsItem: News) => {
    setSelectedNews(newsItem);
    setShowDetail(true);
  };

  const handleDelete = (id: string) => {
    const newsItem = news.find((n) => n.id === id);
    if (newsItem) {
      setNewsToDelete(newsItem);
    }
  };

  const handleConfirmDelete = () => {
    if (newsToDelete) {
      setNews(n => n.filter(ni => ni.id !== newsToDelete.id));
      if (selectedNews?.id === newsToDelete.id) {
        setSelectedNews(null);
        setShowDetail(false);
      }
      setNewsToDelete(null);
    }
  };

  const handleSubmit = async (data: CreateNewsData): Promise<boolean> => {
    if (selectedNews) {
      const updatedNews: News = {
        ...selectedNews,
        ...data,
        updated_at: new Date().toISOString(),
        published_at: data.published ? (selectedNews.published_at || new Date().toISOString()) : undefined,
        companies: demoCompanies.filter(c => data.company_ids?.includes(c.id)),
        categories: demoCategories.filter(c => data.category_ids?.includes(c.id)),
        products: demoProducts.filter(p => data.product_ids?.includes(p.id))
      };
      setNews(n => n.map(ni => ni.id === selectedNews.id ? updatedNews : ni));
    } else {
      const newNews: News = {
        id: Math.random().toString(36).slice(2),
        ...data,
        author_id: 'admin-demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: data.published ? new Date().toISOString() : undefined,
        profiles: { name: "Demo User", email: "demo@example.com" },
        companies: demoCompanies.filter(c => data.company_ids?.includes(c.id)),
        categories: demoCategories.filter(c => data.category_ids?.includes(c.id)),
        products: demoProducts.filter(p => data.product_ids?.includes(p.id)),
      };
      setNews(n => [newNews, ...n]);
    }
    setShowForm(false);
    setSelectedNews(null);
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">Noticias</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las noticias de la correduría en el modo demostración.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Noticia
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Buscar noticias..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <NewsCardSkeleton key={i} />)}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm ? 'No se encontraron noticias que coincidan con tu búsqueda.' : 'No hay noticias disponibles.'}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNews.map(newsItem => (
            <NewsCard key={newsItem.id} news={newsItem} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
           <DialogHeader>
                <DialogTitle>{selectedNews ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
                <DialogDescription>
                    {selectedNews ? 'Edita los detalles de la noticia.' : 'Añade una nueva noticia al catálogo de demostración.'}
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto p-1">
              <NewsForm
                  news={selectedNews || undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowForm(false)}
                  companies={demoCompanies}
                  categories={demoCategories}
                  products={demoProducts}
              />
            </div>
        </DialogContent>
      </Dialog>
      
      <Sheet open={showDetail} onOpenChange={setShowDetail}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
           {selectedNews && <NewsDetail news={selectedNews} onBack={() => setShowDetail(false)} />}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!newsToDelete} onOpenChange={(open) => !open && setNewsToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la noticia{' '}
              <span className="font-semibold">{newsToDelete?.title}</span>.
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
