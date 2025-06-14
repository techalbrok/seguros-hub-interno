
import { Notification } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface NotificationItemProps {
  notification: Notification;
  onSelect: () => void;
}

export const NotificationItem = ({ notification, onSelect }: NotificationItemProps) => {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: es,
  });

  const handleClick = () => {
    onSelect();
    if (notification.url) {
      navigate(notification.url);
    }
  };

  return (
    <DropdownMenuItem
      className="p-0 focus:bg-transparent"
      onSelect={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div className={cn("flex items-start p-3 hover:bg-muted/50 cursor-pointer w-full text-left rounded-md", !notification.is_read && "bg-blue-50 dark:bg-blue-900/20")}>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{notification.title}</p>
          {notification.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
          )}
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {!notification.is_read && (
          <Circle className="h-2.5 w-2.5 fill-primary text-primary ml-4 mt-1 flex-shrink-0" />
        )}
      </div>
    </DropdownMenuItem>
  );
};
