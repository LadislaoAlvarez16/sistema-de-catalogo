import { registerUser } from './actions';
import { calculatePagination } from '@/utils/pagination';

// Mantenemos el mock para Supabase y Next.js navigation
const mockSupabaseInstance = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  insert: jest.fn(),
  auth: {
    signUp: jest.fn(),
  },
};

// Mockeamos el cliente de servidor que usa la action real
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseInstance)),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('TiendaBase Core Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser - Input Validation', () => {
    it('should return an error object if the merchant slug contains spaces or invalid characters', async () => {
      // Instanciamos FormData nativo y hacemos append
      const formData = new FormData();
      formData.append('name', 'Almacén Don Pepito');
      formData.append('slug', 'almacen pepe con espacios');
      formData.append('email', 'pepe@gmail.com');
      formData.append('password', '123456');

      const result = await registerUser(formData);
      
      expect(result).toEqual({ error: 'Invalid slug format. Spaces and special characters are not allowed.' });
    });
  });

  describe('registerUser - Database Conflict', () => {
    it('should return an error object if the merchant slug already exists', async () => {
      // Simulamos que el slug ya existe en la BD
      mockSupabaseInstance.single.mockResolvedValueOnce({ data: { slug: 'almacen-deco' }, error: null });

      const formData = new FormData();
      formData.append('name', 'Decoraciones Nuevas');
      formData.append('slug', 'almacen-deco');
      formData.append('email', 'deco@gmail.com');
      formData.append('password', '123456');

      const result = await registerUser(formData);

      expect(result).toEqual({ error: 'La URL ya está en uso. Por favor, elige otra.' });
    });
  });

  describe('calculatePagination - Edge Cases', () => {
    it('should calculate total pages correctly and handle empty total items gracefully', () => {
      const resultZeroProducts = calculatePagination({ totalItems: 0, itemsPerPage: 10 });
      const resultNormalProducts = calculatePagination({ totalItems: 25, itemsPerPage: 10 });

      expect(resultZeroProducts.totalPages).toBe(1); 
      expect(resultNormalProducts.totalPages).toBe(3);
      expect(resultNormalProducts.offset).toBe(0);
    });
  });
});
