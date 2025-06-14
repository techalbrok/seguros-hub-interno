
-- Primero verificar si el usuario ya tiene un rol, si no, crearlo
DO $$
BEGIN
    -- Intentar actualizar el rol existente
    UPDATE user_roles 
    SET role = 'admin' 
    WHERE user_id = '0cad59d1-4ed0-4b82-accb-25ff02a6f06f';
    
    -- Si no se actualizó ninguna fila, insertar una nueva
    IF NOT FOUND THEN
        INSERT INTO user_roles (user_id, role) 
        VALUES ('0cad59d1-4ed0-4b82-accb-25ff02a6f06f', 'admin');
    END IF;
END $$;

-- Crear trigger para asignar rol automáticamente al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar rol por defecto 'user' para nuevos usuarios
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Crear trigger que se ejecuta después de crear el perfil
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_role();
