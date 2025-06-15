
import { Link } from "react-router-dom";

export const LandingFooter = () => {
    const brokerageName = "HubCore";

    return (
        <footer className="border-t">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {brokerageName}. Todos los derechos reservados.</p>
                <div className="flex items-center gap-4">
                    <a href="#contacto" className="hover:text-blue-600">Hablar con un Experto</a>
                    <Link to="/demo" className="hover:text-blue-600">Demo</Link>
                </div>
            </div>
        </footer>
    );
};
