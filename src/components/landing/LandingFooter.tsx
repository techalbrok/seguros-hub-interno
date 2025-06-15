
import { Link } from "react-router-dom";
import { LegalContentType } from "./LegalModal";

type LandingFooterProps = {
    onOpenLegalModal: (contentKey: LegalContentType) => void;
}

export const LandingFooter = ({ onOpenLegalModal }: LandingFooterProps) => {
    const brokerageName = "HubCore";

    return (
        <footer className="border-t">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {brokerageName}. Todos los derechos reservados.</p>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <a href="#contacto" className="hover:text-blue-600">Hablar con un Experto</a>
                    <Link to="/demo" className="hover:text-blue-600">Demo</Link>
                    <button onClick={() => onOpenLegalModal('privacy')} className="hover:text-blue-600 underline">Política de Privacidad</button>
                    <button onClick={() => onOpenLegalModal('cookies')} className="hover:text-blue-600 underline">Política de Cookies</button>
                    <button onClick={() => onOpenLegalModal('legal')} className="hover:text-blue-600 underline">Aviso Legal</button>
                </div>
            </div>
        </footer>
    );
};
