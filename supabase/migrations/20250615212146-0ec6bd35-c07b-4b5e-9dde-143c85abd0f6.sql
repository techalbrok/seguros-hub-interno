
ALTER TABLE public.companies
ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_companies_is_featured ON public.companies (is_featured);
