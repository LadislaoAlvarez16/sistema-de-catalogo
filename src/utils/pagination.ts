export function calculatePagination({ totalItems, itemsPerPage }: { totalItems: number, itemsPerPage: number }) {
  if (totalItems === 0) return { totalPages: 1, offset: 0 };
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return { totalPages, offset: 0 }; // Puedes ajustar el offset dinámico luego si agregamos currentPage
}
