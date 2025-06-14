
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavigationShortcut } from "@/hooks/useNavigationShortcuts";
import { ExternalLink, Globe, Mail, Phone, FileText, Users, Calendar, Edit, Trash2 } from "lucide-react";

interface ShortcutsListProps {
  shortcuts: NavigationShortcut[];
  onEdit: (shortcut: NavigationShortcut) => void;
  onDelete: (id: string) => void;
}

const getIcon = (iconName: string) => {
  const icons = {
    "external-link": ExternalLink,
    "globe": Globe,
    "mail": Mail,
    "phone": Phone,
    "file-text": FileText,
    "users": Users,
    "calendar": Calendar,
  };
  return icons[iconName as keyof typeof icons] || ExternalLink;
};

export const ShortcutsList = ({ shortcuts, onEdit, onDelete }: ShortcutsListProps) => {
  if (shortcuts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            No hay accesos directos configurados
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {shortcuts.map((shortcut) => {
        const IconComponent = getIcon(shortcut.icon || "external-link");
        
        return (
          <Card key={shortcut.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{shortcut.title}</h3>
                      <Badge variant={shortcut.active ? "default" : "secondary"}>
                        {shortcut.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{shortcut.url}</p>
                    <p className="text-xs text-muted-foreground">Orden: {shortcut.order_position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(shortcut)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(shortcut.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
