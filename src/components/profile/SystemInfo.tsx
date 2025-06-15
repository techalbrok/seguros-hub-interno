
import { Delegation, User as UserType } from "@/types";

interface SystemInfoProps {
    userProfile: UserType;
    delegation: Delegation | null;
    formatDate: (date: Date) => string;
}

export const SystemInfo = ({ userProfile, delegation, formatDate }: SystemInfoProps) => {
    return (
        <div>
            <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                Información del Sistema
            </h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Delegación:</span>
                    <span className="font-medium text-sidebar-primary dark:text-white">
                        {delegation ? delegation.name : 'Sin asignar'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Miembro desde:</span>
                    <span className="font-medium">
                        {formatDate(userProfile.createdAt)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Última actualización:</span>
                    <span className="font-medium">
                        {formatDate(userProfile.updatedAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};
