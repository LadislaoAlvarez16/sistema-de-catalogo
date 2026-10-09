/**
 * @jest-environment node
 */
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.test.local manually
const envPath = path.resolve(process.cwd(), '.env.test.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL.includes('127.0.0.1') && !SUPABASE_URL.includes('localhost')) {
  throw new Error('ABORTING: SUPABASE_URL must point to 127.0.0.1 or localhost for safety.');
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const anonClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });

import { Database } from '../../src/lib/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

describe('RLS Isolation and Security', () => {
  let userA: User, userB: User;
  let accountA: Account, accountB: Account;
  let prodAActive: Product, prodAHidden: Product;
  let prodBActive: Product, prodBHidden: Product;

  let clientA: SupabaseClient<Database>;

  beforeAll(async () => {
    const setupStore = async (email: string, storeName: string) => {
      const { data: userAuth, error: authErr } = await adminClient.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true
      });
      if (authErr) throw authErr;
      const user = userAuth.user;

      const { data: acc, error: accErr } = await adminClient.from('accounts').insert({
        user_id: user.id,
        name: storeName,
        slug: `slug-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        plan: 'basic'
      }).select().single();
      if (accErr) throw accErr;

      const { data: pActive, error: pActErr } = await adminClient.from('products').insert({
        account_id: acc.id,
        name: `${storeName} Active Prod`,
        active: true,
        price: 100,
        category: 'Test',
        slug: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      }).select().single();
      if (pActErr) throw pActErr;

      const { data: pHidden, error: pHidErr } = await adminClient.from('products').insert({
        account_id: acc.id,
        name: `${storeName} Hidden Prod`,
        active: false,
        price: 200,
        category: 'Test',
        slug: `hid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      }).select().single();
      if (pHidErr) throw pHidErr;

      return { user, account: acc, prodActive: pActive, prodHidden: pHidden };
    };

    const storeA = await setupStore('test-a@test.com', 'Store A');
    userA = storeA.user;
    accountA = storeA.account;
    prodAActive = storeA.prodActive;
    prodAHidden = storeA.prodHidden;

    const storeB = await setupStore('test-b@test.com', 'Store B');
    userB = storeB.user;
    accountB = storeB.account;
    prodBActive = storeB.prodActive;
    prodBHidden = storeB.prodHidden;

    clientA = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
    await clientA.auth.signInWithPassword({ email: 'test-a@test.com', password: 'password123' });
  });

  afterAll(async () => {
    if (prodAActive) await adminClient.from('products').delete().eq('id', prodAActive.id);
    if (prodAHidden) await adminClient.from('products').delete().eq('id', prodAHidden.id);
    if (prodBActive) await adminClient.from('products').delete().eq('id', prodBActive.id);
    if (prodBHidden) await adminClient.from('products').delete().eq('id', prodBHidden.id);

    if (accountA) await adminClient.from('accounts').delete().eq('id', accountA.id);
    if (accountB) await adminClient.from('accounts').delete().eq('id', accountB.id);

    if (userA) await adminClient.auth.admin.deleteUser(userA.id);
    if (userB) await adminClient.auth.admin.deleteUser(userB.id);
  });

  it('Anon no lee productos con active:false', async () => {
    const { data, error } = await anonClient.from('products').select('*').eq('id', prodAHidden.id);
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });

  it('El dueño sí lee sus productos con active:false', async () => {
    const { data, error } = await clientA.from('products').select('*').eq('id', prodAHidden.id);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data![0].id).toBe(prodAHidden.id);
  });

  it('A no puede INSERT con el account_id de B', async () => {
    const { data, error } = await clientA.from('products').insert({
      account_id: accountB.id,
      name: 'Hack Prod',
      active: true,
      price: 1,
      category: 'Hack',
      slug: `hack-${Date.now()}`
    }).select();
    
    const success = !error && data && data.length > 0;
    expect(success).toBe(false);
  });

  it('A no puede UPDATE ni DELETE filas de B', async () => {
    const { data: updateData, error: updateError } = await clientA.from('products').update({ price: 9999 }).eq('id', prodBActive.id).select();
    const updateSuccess = !updateError && updateData && updateData.length > 0;
    expect(updateSuccess).toBe(false);

    const { data: deleteData, error: deleteError } = await clientA.from('products').delete().eq('id', prodBActive.id).select();
    const deleteSuccess = !deleteError && deleteData && deleteData.length > 0;
    expect(deleteSuccess).toBe(false);

    const { data: verifyData } = await adminClient.from('products').select('price').eq('id', prodBActive.id).single();
    expect(verifyData?.price).toBe(100);
  });

  it('Columnas legibles de accounts con anon', async () => {
    const { data, error } = await anonClient.from('accounts').select('*').eq('id', accountA.id).single();
    expect(error).toBeNull();
    
    const readableColumns = data ? Object.keys(data) : [];
    console.log(`HALLAZGO (Punto 5) - Columnas legibles por anon en accounts:`, readableColumns.join(', '));
  });
  it('Storage Isolation: A puede subir y borrar en su carpeta', async () => {
    const fileName = `${accountA.id}/testA.txt`;
    const { error: uploadError } = await clientA.storage.from('product-images').upload(fileName, 'dummy content');
    expect(uploadError).toBeNull();
    
    const { error: deleteError } = await clientA.storage.from('product-images').remove([fileName]);
    expect(deleteError).toBeNull();
  });

  it('Storage Isolation: A NO puede subir ni borrar en la carpeta de B', async () => {
    const fileName = `${accountB.id}/testB.txt`;
    
    // A intenta subir a la carpeta de B
    const { error: uploadError } = await clientA.storage.from('product-images').upload(fileName, 'hacked content');
    expect(uploadError).not.toBeNull();
    // Comprobar que el error es de política de seguridad, no de bucket inexistente
    expect(uploadError?.message).toMatch(/violates row-level security policy|duplicate key|not authorized|Unauthorized|forbidden|Access denied/i);
    
    // Admin sube un archivo real en B para que exista
    await adminClient.storage.from('product-images').upload(fileName, 'real content');
    
    // A intenta borrar el archivo de B
    const { data: deleteData, error: deleteError } = await clientA.storage.from('product-images').remove([fileName]);
    
    // Comprobar que la respuesta no borra nada (o es error o data vacio)
    if (deleteData) {
        expect(deleteData).toHaveLength(0);
    } else {
        expect(deleteError).not.toBeNull();
    }
    
    // Verificar con el cliente admin que el archivo SIGUE existiendo
    const { data: listData } = await adminClient.storage.from('product-images').list(accountB.id);
    const fileExists = listData?.some(f => f.name === 'testB.txt');
    expect(fileExists).toBe(true);
    
    // Teardown admin
    await adminClient.storage.from('product-images').remove([fileName]);
  });

  it('Storage Isolation: Anon NO puede listar el bucket pero SI puede leer URLs publicas', async () => {
    const fileName = `${accountA.id}/public-test.txt`;
    await adminClient.storage.from('product-images').upload(fileName, 'public content');

    // Anon intenta listar la carpeta
    const { data: listData, error: listError } = await anonClient.storage.from('product-images').list(accountA.id);
    
    if (listData) {
        expect(listData).toHaveLength(0);
    } else {
        expect(listError).not.toBeNull();
    }

    // Anon obtiene la URL y verifica que funciona el acceso directo HTTP (bucket public=true)
    const { data: publicUrlData } = anonClient.storage.from('product-images').getPublicUrl(fileName);
    const response = await fetch(publicUrlData.publicUrl);
    
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe('public content');

    // Teardown admin
    await adminClient.storage.from('product-images').remove([fileName]);
  });
});
