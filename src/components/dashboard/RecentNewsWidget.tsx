
import { useNews } from '@/hooks/useNews';
import { Newspaper } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { Link } from 'react-router-dom';

const formatDateLocal = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    } catch {
        return dateString;
    }
};

export const RecentNewsWidget = () => {
    const { news, loading } = useNews();

    const recentNews = news.slice(0, 3);

    return (
        <DashboardWidget
            title="Últimas Noticias"
            icon={Newspaper}
            viewAllHref="/news"
            isLoading={loading}
            className="fade-in-up stagger-animation"
            style={{ animationDelay: '800ms' }}
        >
            <div className="space-y-4">
                {recentNews.length > 0 ? (
                    recentNews.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            {item.featured_image ? (
                                <img src={item.featured_image} alt={item.title} className="h-12 w-12 rounded-lg object-cover"/>
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                    <Newspaper className="h-6 w-6 text-muted-foreground"/>
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <Link to={`/news/${item.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                                    {item.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">{formatDateLocal(item.created_at)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No hay noticias recientes.</p>
                )}
            </div>
        </DashboardWidget>
    );
};
