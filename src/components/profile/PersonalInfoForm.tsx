
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@/types";

interface PersonalInfoFormProps {
    userProfile: UserType;
    formData: { name: string };
    onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getRoleColor: (role: string) => string;
}

export const PersonalInfoForm = ({ userProfile, formData, onFormChange, getRoleColor }: PersonalInfoFormProps) => {
    return (
        <div>
            <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                Información Personal
            </h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={onFormChange}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={userProfile.email}
                        disabled
                        className="bg-gray-100"
                    />
                    <p className="text-sm text-muted-foreground">
                        El email no puede ser modificado
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rol:</span>
                    <Badge className={getRoleColor(userProfile.role)}>
                        {userProfile.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                </div>
            </div>
        </div>
    );
};
