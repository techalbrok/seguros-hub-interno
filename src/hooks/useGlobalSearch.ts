
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Package, Newspaper, Building } from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  type: 'Usuario' | 'Compañía' | 'Producto' | 'Noticia' | 'Delegación';
  url: string;
  icon: React.ElementType;
}

const fetchSearchableData = async (): Promise<SearchResult[]> => {
    console.log("Fetching global search data...");
    try {
        const [usersRes, companiesRes, productsRes, newsRes, delegationsRes] = await Promise.all([
            supabase.from('profiles').select('id, name').limit(100),
            supabase.from('companies').select('id, name').limit(100),
            supabase.from('products').select('id, title').limit(100),
            supabase.from('news').select('id, title').limit(100),
            supabase.from('delegations').select('id, name').limit(100),
        ]);

        if (usersRes.error) throw usersRes.error;
        if (companiesRes.error) throw companiesRes.error;
        if (productsRes.error) throw productsRes.error;
        if (newsRes.error) throw newsRes.error;
        if (delegationsRes.error) throw delegationsRes.error;
        
        console.log("Global search data fetched successfully.");

        const users = (usersRes.data || []).map((u): SearchResult => ({ id: u.id, title: u.name, type: 'Usuario', url: '/users', icon: Users }));
        const companies = (companiesRes.data || []).map((c): SearchResult => ({ id: c.id, title: c.name, type: 'Compañía', url: '/companies', icon: Building2 }));
        const products = (productsRes.data || []).map((p): SearchResult => ({ id: p.id, title: p.title, type: 'Producto', url: '/products', icon: Package }));
        const news = (newsRes.data || []).map((n): SearchResult => ({ id: n.id, title: n.title, type: 'Noticia', url: '/news', icon: Newspaper }));
        const delegations = (delegationsRes.data || []).map((d): SearchResult => ({ id: d.id, title: d.name, type: 'Delegación', url: '/delegations', icon: Building }));

        return [...users, ...companies, ...products, ...news, ...delegations];
    } catch(error) {
        console.error("Error fetching global search data:", error);
        return [];
    }
}

export const useGlobalSearch = () => {
    return useQuery<SearchResult[]>({
        queryKey: ['global-search'],
        queryFn: fetchSearchableData,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
