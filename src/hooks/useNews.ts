
import { useNews as useRealNews, CreateNewsData, News } from './news';
import { useDemoMode } from './useDemoMode';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './useAuth';

export const useNews = () => {
    const { isDemo, demoData, setDemoData } = useDemoMode();
    const { toast } = useToast();
    const { user, profile } = useAuth();
    
    if (isDemo) {
        const createNews = async (data: CreateNewsData) => {
            const newNews = {
                id: `demo-news-${uuidv4()}`,
                ...data,
                author_id: user?.id || 'demo-user-admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                author: { name: profile?.name || 'Admin Demo' }
            };
            setDemoData({ ...demoData, news: [newNews, ...demoData.news] });
            return true;
        };
        
        const updateNews = async (id: string, data: Partial<News>) => {
            setDemoData({
                ...demoData,
                news: demoData.news.map(n => n.id === id ? { ...n, ...data, updated_at: new Date().toISOString() } : n)
            });
            return true;
        };
        
        const deleteNews = async (id: string) => {
            setDemoData({ ...demoData, news: demoData.news.filter(n => n.id !== id) });
            return true;
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

    const realNews = useRealNews();
    
    const updateNewsWrapper = async (id: string, data: any) => {
        return realNews.updateNews({ id, ...data });
    }

    return { ...realNews, updateNews: updateNewsWrapper };
};

export type { News, CreateNewsData };
