
-- 1. Create table for notifications
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    url text,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

-- 4. Policy: Users can update their own notifications (e.g., to mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create a function to notify admins when a new user signs up
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- 6. Create a trigger to execute the function after a new user is created
CREATE TRIGGER on_new_user_created_notify_admins
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_on_new_user();

-- 7. Enable Realtime updates on the notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

