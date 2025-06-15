import { useState, useEffect } from 'react';
import { useSystemAlerts } from '@/hooks/useSystemAlerts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { SystemAlert } from '@/hooks/useSystemAlertsManager';

const alertIcons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <TriangleAlert className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
};

const alertVariants = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300",
};

export const SystemAlerts = () => {
    const { alerts, isLoading } = useSystemAlerts();
    const [visibleAlerts, setVisibleAlerts] = useState<SystemAlert[]>([]);
    const [dismissingAlerts, setDismissingAlerts] = useState<string[]>([]);

    useEffect(() => {
        const storedDismissed = localStorage.getItem('dismissedSystemAlerts');
        const dismissedIds = storedDismissed ? JSON.parse(storedDismissed) : [];
        setVisibleAlerts(alerts.filter(alert => !dismissedIds.includes(alert.id)));
    }, [alerts]);

    const handleDismiss = (alertId: string) => {
        setDismissingAlerts(prev => [...prev, alertId]);

        setTimeout(() => {
            const storedDismissed = localStorage.getItem('dismissedSystemAlerts');
            const dismissedIds = storedDismissed ? JSON.parse(storedDismissed) : [];
            if (!dismissedIds.includes(alertId)) {
                const newDismissed = [...dismissedIds, alertId];
                localStorage.setItem('dismissedSystemAlerts', JSON.stringify(newDismissed));
            }
            setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
            setDismissingAlerts(prev => prev.filter(id => id !== alertId));
        }, 300); // Corresponds to fade-out animation duration
    };

    if (isLoading) {
        return null;
    }

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
                                {alert.link && alert.link_text && (
                                    <Link to={alert.link} className="mt-2 inline-block font-semibold underline hover:text-current/80">
                                        {alert.link_text}
                                    </Link>
                                )}
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
