
-- Añadir una columna para la terminología a la tabla de configuración
ALTER TABLE public.brokerage_config
ADD COLUMN terminology jsonb;

-- Actualizar la fila de configuración existente con los valores por defecto
UPDATE public.brokerage_config
SET terminology = '{
  "dashboard": { "singular": "Dashboard", "plural": "Dashboard" },
  "user": { "singular": "Usuario", "plural": "Usuarios" },
  "delegation": { "singular": "Delegación", "plural": "Delegaciones" },
  "company": { "singular": "Compañía", "plural": "Compañías" },
  "product": { "singular": "Producto", "plural": "Productos" },
  "department": { "singular": "Departamento", "plural": "Departamentos" },
  "news": { "singular": "Noticia", "plural": "Noticias" },
  "settings": { "singular": "Configuración", "plural": "Configuración" }
}'::jsonb;

-- Establecer un valor por defecto para futuras configuraciones
ALTER TABLE public.brokerage_config
ALTER COLUMN terminology
SET DEFAULT '{
  "dashboard": { "singular": "Dashboard", "plural": "Dashboard" },
  "user": { "singular": "Usuario", "plural": "Usuarios" },
  "delegation": { "singular": "Delegación", "plural": "Delegaciones" },
  "company": { "singular": "Compañía", "plural": "Compañías" },
  "product": { "singular": "Producto", "plural": "Productos" },
  "department": { "singular": "Departamento", "plural": "Departamentos" },
  "news": { "singular": "Noticia", "plural": "Noticias" },
  "settings": { "singular": "Configuración", "plural": "Configuración" }
}'::jsonb;
