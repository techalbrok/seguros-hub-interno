
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { sections } from '@/components/users/PermissionsFormSection';

interface Profile {
  name: string;
  avatarUrl?: string;
}

type UserRole = 'admin' | 'user' | null;
type UserPermissions = Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    role: UserRole;
    isAdmin: boolean;
    permissions: UserPermissions | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: (options?: { quiet?: boolean | undefined; }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchProfile = useCallback(async (userId: string) => {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', userId)
            .single();
        
        if (profileError) {
            console.error('Error fetching profile:', profileError.message);
            setProfile(null);
        } else if (profileData) {
            setProfile({ name: profileData.name, avatarUrl: profileData.avatar_url });
        }

        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching user role:', roleError.message);
            setRole(null);
            setPermissions(null);
        } else if (roleData) {
            setRole(roleData.role);
            
            if (roleData.role === 'admin') {
                const adminPermissions: UserPermissions = {};
                sections.forEach(section => {
                    adminPermissions[section.key] = { canCreate: true, canEdit: true, canDelete: true, canView: true };
                });
                setPermissions(adminPermissions);
            } else {
                const { data: permissionsData, error: permissionsError } = await supabase
                    .from('user_permissions')
                    .select('*')
                    .eq('user_id', userId);

                if (permissionsError) {
                    console.error('Error fetching user permissions:', permissionsError.message);
                    setPermissions(null);
                } else if (permissionsData && permissionsData.length > 0) {
                    const userPermissions: UserPermissions = {};
                    sections.forEach(section => {
                        const dbPerm = permissionsData.find(p => p.section === section.key);
                        userPermissions[section.key] = {
                            canCreate: dbPerm?.can_create || false,
                            canEdit: dbPerm?.can_edit || false,
                            canDelete: dbPerm?.can_delete || false,
                            canView: dbPerm?.can_view !== false,
                        };
                    });
                    setPermissions(userPermissions);
                } else {
                    // No specific permissions, set defaults (all false except view)
                    const defaultPermissions: UserPermissions = {};
                    sections.forEach(section => {
                      defaultPermissions[section.key] = { canCreate: false, canEdit: false, canDelete: false, canView: true };
                    });
                    setPermissions(defaultPermissions);
                }
            }
        } else {
            // Default to 'user' if no role is found for safety
            setRole('user');
            // No role, so set default permissions
            const defaultPermissions: UserPermissions = {};
            sections.forEach(section => {
              defaultPermissions[section.key] = { canCreate: false, canEdit: false, canDelete: false, canView: true };
            });
            setPermissions(defaultPermissions);
        }
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    setTimeout(() => fetchProfile(session.user.id), 0);
                } else {
                    setProfile(null);
                    setRole(null);
                    setPermissions(null);
                }
            }
        );

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Sign in error:', error);
                let errorMessage = error.message;
                
                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Email o contraseña incorrectos';
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage = 'Por favor, confirma tu email antes de iniciar sesión';
                }
                
                toast({
                    title: "Error de autenticación",
                    description: errorMessage,
                    variant: "destructive",
                });
                return false;
            }

            console.log('Sign in successful:', data.user?.email);
            toast({
                title: "Sesión iniciada",
                description: "Has iniciado sesión correctamente",
            });
            return true;
        } catch (error) {
            console.error('Error signing in:', error);
            toast({
                title: "Error",
                description: "Error al iniciar sesión",
                variant: "destructive",
            });
            return false;
        }
    };

    const signOut = async (options?: { quiet?: boolean }) => {
        try {
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.error('Sign out error:', error);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
            return false;
          }

          if (!options?.quiet) {
            toast({
              title: "Sesión cerrada",
              description: "Has cerrado sesión correctamente",
            });
          }
          return true;
        } catch (error) {
          console.error('Error signing out:', error);
          toast({
            title: "Error",
            description: "Error al cerrar sesión",
            variant: "destructive",
          });
          return false;
        }
    };

    const value = {
        user,
        session,
        profile,
        role,
        isAdmin: role === 'admin',
        permissions,
        loading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
