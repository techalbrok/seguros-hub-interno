
import { Megaphone } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export const DemoBanner = () => {
  return (
    <div className="bg-yellow-100 border-b-2 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-center text-sm z-10 relative">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            <p className="font-semibold">
            Estás en el Modo Demo.
            <span className="hidden sm:inline"> Los cambios se guardan localmente en tu navegador.</span>
            </p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 hover:bg-black/10 dark:hover:bg-white/10" asChild>
            <Link to="/landing">Salir del Demo</Link>
        </Button>
      </div>
    </div>
  );
};
