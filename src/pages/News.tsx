
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search } from 'lucide-react';
import { useNews, News } from '@/hooks/useNews';
import { NewsCard } from '@/components/NewsCard';
import { NewsForm } from '@/components/NewsForm';
import { NewsDetail } from '@/components/NewsDetail';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanies } from '@/hooks/useCompanies';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useProducts } from '@/hooks/useProducts';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

const NewsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  const {
    news,
    loading,
    createNews,
    updateNews,
    deleteNews
  } = useNews();
  const { companies } = useCompanies();
  const { categories } = useProductCategories();
  const { products } = useProducts();

  const filteredNews = news.filter(item => {
    const searchTermMatch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const companyMatch = !companyFilter || item.companies?.some(c => c.id === companyFilter);
    const categoryMatch = !categoryFilter || item.categories?.some(c => c.id === categoryFilter);
    const productMatch = !productFilter || item.products?.some(p => p.id === productFilter);

    return searchTermMatch && companyMatch && categoryMatch && productMatch;
  });

  const handleCreate = () => {
    setSelectedNews(null);
    setViewMode('create');
  };
  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setViewMode('edit');
  };
  const handleView = (newsItem: News) => {
    setSelectedNews(newsItem);
    setViewMode('detail');
  };
  const handleDelete = (id: string) => {
    setNewsToDelete(id);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (newsToDelete) {
      await deleteNews(newsToDelete);
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };
  const handleSubmit = async (data: any) => {
    if (viewMode === 'edit' && selectedNews) {
      const success = await updateNews(selectedNews.id, data);
      if (success) {
        setViewMode('list');
        setSelectedNews(null);
      }
      return success;
    } else {
      const success = await createNews(data);
      if (success) {
        setViewMode('list');
      }
      return success;
    }
  };
  const handleCancel = () => {
    setViewMode('list');
    setSelectedNews(null);
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return <NewsForm news={selectedNews || undefined} onSubmit={handleSubmit} onCancel={handleCancel} />;
  }

  if (viewMode === 'detail' && selectedNews) {
    return <NewsDetail news={selectedNews} onBack={() => setViewMode('list')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">Noticias</h1>
          <p className="text-muted-foreground mt-2">
            Administra las noticias de la correduría
          </p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Noticia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Buscar noticias..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por compañía" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las compañías</SelectItem>
            {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por producto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los productos</SelectItem>
            {products.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando noticias...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm || companyFilter || categoryFilter || productFilter ? 'No se encontraron noticias que coincidan con tu búsqueda.' : 'No hay noticias disponibles.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNews.map(newsItem => <NewsCard key={newsItem.id} news={newsItem} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />)}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia será eliminada permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default NewsPage;
