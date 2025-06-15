import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Package, Newspaper, Building } from 'lucide-react';
import { useBrokerageConfig, defaultTerminology } from '@/hooks/useBrokerageConfig';

export interface SearchResult {
  id: string;
  title: string;
  type: 'Usuario' | 'Compañía' | 'Producto' | 'Noticia' | 'Delegación';
  url: string;
  icon: React.ElementType;
}

const fetchSearchableData = async (terminology: any): Promise<SearchResult[]> => {
    const t = terminology || defaultTerminology;
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
        
        const users = (usersRes.data || []).map((u): SearchResult => ({ id: u.id, title: u.name, type: t.user.singular, url: '/users', icon: Users }));
        const companies = (companiesRes.data || []).map((c): SearchResult => ({ id: c.id, title: c.name, type: t.company.singular, url: '/companies', icon: Building2 }));
        const products = (productsRes.data || []).map((p): SearchResult => ({ id: p.id, title: p.title, type: t.product.singular, url: '/products', icon: Package }));
        const news = (newsRes.data || []).map((n): SearchResult => ({ id: n.id, title: n.title, type: t.news.singular, url: '/news', icon: Newspaper }));
        const delegations = (delegationsRes.data || []).map((d): SearchResult => ({ id: d.id, title: d.name, type: t.delegation.singular, url: '/delegations', icon: Building }));

        return [...users, ...companies, ...products, ...news, ...delegations];
    } catch(error) {
        console.error("Error in global search:", error);
        return [];
    }
}

export const useGlobalSearch = () => {
    const { config } = useBrokerageConfig();
    const terminology = config?.terminology;

    return useQuery<SearchResult[]>({
        queryKey: ['global-search', terminology],
        queryFn: () => fetchSearchableData(terminology),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: !!terminology,
    });
};
