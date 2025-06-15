
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Bell, MailCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import type { Notification } from '@/hooks/useNotifications';

const demoNotifications: Notification[] = [
    {
        id: '1',
        user_id: 'demo-user',
        title: '¡Bienvenido al modo Demo!',
        description: 'Explora todas las funcionalidades de la plataforma.',
        url: null,
        is_read: false,
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        user_id: 'demo-user',
        title: 'Nueva noticia publicada',
        description: 'Se ha publicado una nueva noticia sobre seguros de coche.',
        url: '/demo/news',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: '3',
        user_id: 'demo-user',
        title: 'Actualización de producto',
        description: 'El producto "Seguro de Hogar" ha sido actualizado.',
        url: '/demo/products',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
];

export const DemoNotificationsDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = (id: string) => {
        setNotifications(currentNotifications => currentNotifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(currentNotifications => currentNotifications.map(n => ({ ...n, is_read: true })));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
                <div className="flex justify-between items-center px-4 pt-2">
                    <DropdownMenuLabel className="p-0">Notificaciones</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                            }}
                        >
                            <MailCheck className="mr-2 h-4 w-4" />
                            Marcar todas leídas
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">No tienes notificaciones</p>
                    ) : (
                        <div className="p-1">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onSelect={() => markAsRead(notification.id)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
