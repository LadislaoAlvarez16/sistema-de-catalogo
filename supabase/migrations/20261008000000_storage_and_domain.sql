-- a) Crear el bucket 'product-images' publico si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- b) Crear la politica de Storage para restringir acceso por carpeta de usuario (basado en account.id)
CREATE POLICY "Acceso restringido por carpeta de usuario"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.accounts WHERE user_id = auth.uid()
  )
);



-- c) Crear indice UNIQUE sobre custom_domain normalizado a minusculas
CREATE UNIQUE INDEX IF NOT EXISTS accounts_custom_domain_unique
ON public.accounts (lower(custom_domain))
WHERE custom_domain IS NOT NULL;
