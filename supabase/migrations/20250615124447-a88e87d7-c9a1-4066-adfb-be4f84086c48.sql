
-- 1. Creamos un tipo de dato para los diferentes tipos de alerta
CREATE TYPE public.system_alert_type AS ENUM ('info', 'warning', 'error', 'success');

-- 2. Creamos la tabla para las alertas del sistema
CREATE TABLE public.system_alerts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    link_text text,
    type public.system_alert_type NOT NULL DEFAULT 'info',
    active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Habilitamos la seguridad a nivel de fila (RLS)
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- 4. Creamos las políticas de seguridad
-- Los administradores pueden gestionar todas las alertas del sistema
CREATE POLICY "Admins can manage system alerts"
ON public.system_alerts
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Los usuarios autenticados pueden ver las alertas activas y no expiradas
CREATE POLICY "Users can view active system alerts"
ON public.system_alerts
FOR SELECT
USING (
    active = true AND
    (expires_at IS NULL OR expires_at > now())
);
