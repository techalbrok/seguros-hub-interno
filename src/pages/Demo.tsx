
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const DemoPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg text-center animate-fade-in">
        <CardHeader>
          <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 p-4 rounded-full w-fit">
            <Construction className="w-8 h-8" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Modo Demo en Construcción</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Estamos trabajando para traerte una experiencia de demostración interactiva. ¡Vuelve pronto!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            La demo te permitirá explorar todas las funcionalidades de la aplicación con datos de prueba, guardando tus cambios localmente en tu navegador.
          </p>
          <Link to="/landing">
            <Button>Volver a la Landing Page</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;
