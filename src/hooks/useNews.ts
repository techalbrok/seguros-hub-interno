
import { useNews as useRealNews } from './news';
import type { News, CreateNewsData } from './news';
import { useDemoMode } from './useDemoMode';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './useAuth';

export const useNews = () => {
    const { isDemo, demoData, setDemoData } = useDemoMode();
    const { toast } = useToast();
    const { user, profile } = useAuth();
    
    if (isDemo) {
        const createNews = (data: CreateNewsData) => {
            const newNews = {
                id: `demo-news-${uuidv4()}`,
                ...data,
                author_id: user?.id || 'demo-user-admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                author: { name: profile?.name || 'Admin Demo' }
            };
            setDemoData({ ...demoData, news: [newNews, ...demoData.news] });
        };
        
        const updateNews = (data: Partial<News> & { id: string }) => {
            setDemoData({
                ...demoData,
                news: demoData.news.map(n => n.id === data.id ? { ...n, ...data, updated_at: new Date().toISOString() } : n)
            });
        };
        
        const deleteNews = (id: string) => {
            setDemoData({ ...demoData, news: demoData.news.filter(n => n.id !== id) });
        };
        
        return {
            news: demoData.news,
            loading: false,
            error: null,
            createNews,
            updateNews,
            deleteNews,
            isCreating: false,
            isUpdating: false,
            isDeleting: false,
        };
    }

    return useRealNews();
};

export type { News, CreateNewsData };
