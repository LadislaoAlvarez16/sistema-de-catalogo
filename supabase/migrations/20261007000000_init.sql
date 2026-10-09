CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    plan text NOT NULL,
    slug text NOT NULL,
    whatsapp text,
    description text,
    custom_domain text
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid REFERENCES accounts(id),
    name text,
    description text,
    price numeric,
    category text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    image_url text,
    slug text,
    category_id uuid
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo al dueño de la cuenta" ON accounts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Permitir lectura publica de accounts" ON accounts FOR SELECT TO public USING (true);

CREATE POLICY "Permitir todo al dueño de la cuenta" ON products FOR ALL TO authenticated USING (account_id IN (SELECT accounts.id FROM accounts WHERE accounts.user_id = auth.uid())) WITH CHECK (account_id IN (SELECT accounts.id FROM accounts WHERE accounts.user_id = auth.uid()));
CREATE POLICY "Public read products" ON products FOR SELECT TO public USING (active = true);
