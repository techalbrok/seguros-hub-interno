
import { useCompanies } from '@/hooks/useCompanies';
import { Building2 } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { Link } from 'react-router-dom';

export const FeaturedCompaniesWidget = () => {
    const { companies, isLoading } = useCompanies();

    const featuredCompanies = companies.filter(company => company.isFeatured).slice(0, 3);

    return (
        <DashboardWidget
            title="Compañías Destacadas"
            icon={Building2}
            viewAllHref="/companies"
            isLoading={isLoading}
            className="fade-in-up stagger-animation"
            style={{ animationDelay: '900ms' }}
        >
            <div className="space-y-4">
                {featuredCompanies.length > 0 ? (
                    featuredCompanies.map((company, index) => (
                         <div key={company.id} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-muted-foreground"/>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <Link to={`/companies/${company.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                                    {company.name}
                                </Link>
                                <p className="text-sm text-muted-foreground truncate">{company.commercialManager}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No hay compañías destacadas para mostrar.</p>
                )}
            </div>
        </DashboardWidget>
    );
};
