
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileHeader } from "./profile/UserProfileHeader";
import { PersonalInfoForm } from "./profile/PersonalInfoForm";
import { SystemInfo } from "./profile/SystemInfo";
import { DelegationInfoCard } from "./profile/DelegationInfoCard";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";

export const UserProfile = () => {
    const { 
        userProfile, 
        delegation, 
        loading, 
        saving, 
        formData, 
        setFormData, 
        handleSave, 
        handleAvatarUpload 
    } = useUserProfile();

    const { config: brokerageConfig } = useBrokerageConfig();

    const getRoleColor = (role: string) => {
        return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No se pudo cargar el perfil de usuario</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <UserProfileHeader 
                    brokerageConfig={brokerageConfig}
                    userProfile={userProfile}
                    onAvatarUpload={handleAvatarUpload}
                />
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PersonalInfoForm 
                            userProfile={userProfile}
                            formData={formData}
                            onFormChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            getRoleColor={getRoleColor}
                        />
                        <SystemInfo
                            userProfile={userProfile}
                            delegation={delegation}
                            formatDate={formatDate}
                        />
                    </div>
                    
                    {delegation && <DelegationInfoCard delegation={delegation} />}

                    <div className="flex justify-end space-x-3">
                        <Button 
                            onClick={handleSave} 
                            disabled={saving || (formData.name === userProfile.name)}
                            className="corporate-button"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
