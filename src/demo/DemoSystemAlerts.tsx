
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DemoAlert = {
    id: string;
    type: 'info' | 'success' | 'warning';
    title: string;
    message: string;
};

const demoAlerts: DemoAlert[] = [
    {
        id: 'demo-alert-info',
        type: 'info',
        title: 'Bienvenido a la Plataforma Demo',
        message: 'Esta es una vista previa interactiva. Siéntete libre de explorar las diferentes secciones para conocer la estructura y funcionalidades principales.',
    },
    {
        id: 'demo-alert-warning',
        type: 'warning',
        title: 'Funcionalidad Limitada',
        message: 'Ten en cuenta que esta es una versión de demostración. Muchas de las características avanzadas y flujos de trabajo completos han sido simplificados o no están disponibles.',
    },
    {
        id: 'demo-alert-success',
        type: 'success',
        title: '¡Explora el Modo Oscuro!',
        message: 'Hemos habilitado el modo oscuro para que puedas probarlo. Usa el icono de sol/luna en la esquina superior derecha para cambiar de tema.',
    },
];


const alertIcons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <TriangleAlert className="h-5 w-5" />,
};

const alertVariants = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300",
};

export const DemoSystemAlerts = () => {
    const [visibleAlerts, setVisibleAlerts] = useState<DemoAlert[]>([]);
    const [dismissingAlerts, setDismissingAlerts] = useState<string[]>([]);
    const storageKey = 'dismissedDemoSystemAlerts';

    useEffect(() => {
        const storedDismissed = localStorage.getItem(storageKey);
        const dismissedIds = storedDismissed ? JSON.parse(storedDismissed) : [];
        setVisibleAlerts(demoAlerts.filter(alert => !dismissedIds.includes(alert.id)));
    }, []);

    const handleDismiss = (alertId: string) => {
        setDismissingAlerts(prev => [...prev, alertId]);

        setTimeout(() => {
            const storedDismissed = localStorage.getItem(storageKey);
            const dismissedIds = storedDismissed ? JSON.parse(storedDismissed) : [];
            if (!dismissedIds.includes(alertId)) {
                const newDismissed = [...dismissedIds, alertId];
                localStorage.setItem(storageKey, JSON.stringify(newDismissed));
            }
            setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
            setDismissingAlerts(prev => prev.filter(id => id !== alertId));
        }, 300);
    };

    if (visibleAlerts.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {visibleAlerts.map((alert, index) => (
                <Alert
                    key={alert.id}
                    className={`${alertVariants[alert.type]} ${dismissingAlerts.includes(alert.id) ? 'animate-fade-out' : 'animate-fade-in'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-start gap-4">
                        <div className="pt-0.5 text-current">
                            {alertIcons[alert.type]}
                        </div>
                        <div className="flex-1">
                            <AlertTitle className="font-bold">{alert.title}</AlertTitle>
                            <AlertDescription>
                                <p>{alert.message}</p>
                            </AlertDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 -mr-2 -mt-2 shrink-0 text-current/70 hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
                            onClick={() => handleDismiss(alert.id)}
                            disabled={dismissingAlerts.includes(alert.id)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Descartar</span>
                        </Button>
                    </div>
                </Alert>
            ))}
        </div>
    );
};

