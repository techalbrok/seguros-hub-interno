
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
import { Link } from "react-router-dom";

export const LandingFooter = () => {
    const { config } = useBrokerageConfig();
    const brokerageName = config?.name || "Intranet Correduría";

    return (
        <footer className="border-t">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {brokerageName}. Todos los derechos reservados.</p>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hover:text-primary">Acceso Clientes</Link>
                    <Link to="/demo" className="hover:text-primary">Demo</Link>
                </div>
            </div>
        </footer>
    );
};
