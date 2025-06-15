
-- Fix for get_user_role: set explicit search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
 RETURNS user_role
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN (
    SELECT role 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    LIMIT 1
  );
END;
$function$;

---

-- Fix for is_admin: set explicit search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$function$;

---

-- Fix for handle_new_user: set explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

---

-- Fix for handle_new_user_role: set explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Insertar rol por defecto 'user' para nuevos usuarios
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

---

-- Fix for notify_admins_on_new_user: set explicit search_path
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    admin_record RECORD;
BEGIN
    FOR admin_record IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
        INSERT INTO public.notifications (user_id, title, description, url)
        VALUES (
            admin_record.user_id,
            'Nuevo usuario registrado',
            'Se ha registrado un nuevo usuario: ' || NEW.email,
            '/users'
        );
    END LOOP;
    RETURN NEW;
END;
$function$;
