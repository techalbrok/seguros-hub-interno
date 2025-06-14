
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
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
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
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

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
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

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
  };
};
